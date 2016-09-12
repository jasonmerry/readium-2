/**
 * This document is a simple example of how to use the proposed 
 * shared-js interfaces.  It is not intended to actally WORK, 
 * but simply to demonstrate how the interfaces might be used. 
 *  
 * The examples assume that the "ReadingSystem" implements all 
 * the relevant interfaces 
 *  
 * @author rkwright (9/10/2016) - initial draft
 * 
 */

    var severity = { "Fatal", "Error", "Warning", "Info" };

    }
    /*
     * Allocate the ReadingSystem object.  Just pass in a trivial 
     * config object 
     */
    var config = [ {"margin":"1em" } ];

    var rs = new ReadingSystem(config);

    /*
     *  First initialize the renderer by passing in the container within
     *  which the document should be rendered.  We just create the
     *  container element ourselves and attach it to the document body
     *  element.  Note that this is the outermost document - not our EPUB
     *  "Document"
     */
    var container = document.createElement( 'div' );
    document.body.appendChild( container );

    // then init the renderer
    rs.initRenderer(container);

    // now load the EPUB via the ReadingSytem:Document interface.  Just a local file
    // Since we didn't specify a firstPage config item, it will simply open the document 
    // to the first page, which in this case is the cover page
    var epubDoc = rs.openEPUB("MobyDick.epub");

    // check and see if any errors occurred
    var errorList = rs.getErrorRoot();
    if (errorList.getCount() > 0) {
        // Uh-oh. Errors occurred
        console.log("Found " + errorList.getCount + " errors occurred");
        for (var i=0; i<errorList.getCount(); i++ ) {
            var err = errorList.getChild(i);
            console.log(i + ": error ID: " + err.getID() + " severity: " + 
                            severity[err.getSeverity()] + " string: " + err.getErrorString());
        }
    }

    /*
     * simple navigation examples.  Normally, these would be in some type of event loop 
     * but these snippets are just show how it might be done
     */

    // just go to the next screen
    rs.nextScreen();

    // jump to the end of the document
    rs.endDocument();

    // pop the previous location from the stack and go there (back button behaviour)
    var loc = rs.getPreviousLocation();
    rs.gotoLocation( loc );

    // enable disable navigation UI if we are at begin/end of document
    if (rs.isFirstScreen()) {
        // disable reverse navigation UI 
    }

    if (rs.isFinalScreen()) {
        // disable forward navigation UI
    }

    // fetch the total number of screens - TODO - use promise here
    rs.getScreenCount( function(nScreens){
        // display the number of screens in the UI
    });

    // get the number of the current screen - TODO - use promise here
    var curLoc = rs.getScreenBegin();
    rs.getScreenFromLoc( curLoc, function() {
        // display the current screen index
    });

    /* 
     * simple demonstration of NavDoc access
     */

    // fetch the nav doc element with epub:type of "toc"
    var navElms = epubDoc.getNavElms();

    // first get the toc (it MUST be the first elm, per interface spec
    var toc = navElms[0].object;

    // then append that element to the proper location in the UI, e.g.
    $('#readium-toc-body').append(toc.getNode());

    // alternatively, the app may want to extract the contents of the TOC for their
    // own presentation of the TOC.  For this the app can use the NavDocItem to recursively 
    // walk down the tree
    var walkTOC = function( item ) {
        for ( var i=0; i<item.getChildCount(); i++ ) {
            var child = item.getChild(i);

            // do stuff with the child item, then...

            if (child.getChildCount() > 0) {
                walkTOC(child)
            }
        }
    }

    // just call the recursive function to start the process
    walkTOC(toc);

    /*
     * This same process can be performed for the other "standard" nav elements 
     * The app will need to check for any additional nav elmeents with getOtherNav()  
     */
    if (navElms[1] != null) {
        // process the page-list nav elm
    }
    if (navElms[2] != null) {
        // process the landmarks nav elm
    }

    // finally, check if there are additional, custom nav elements and process them 
    for ( var n=3; n < navElms.length; n++ ) {
        console.log("nav elm name: " + navElms[n].name);
    }

    /*
     * Metadata handling is quite specific to the application, so the metadata APIs 
     * are relatively low-level so  app developers can just fetch what they are interested 
     * in and do whatever they want with it  
     */

    // fetch the metadata root element
    var opf = rs.getPackage();
    var metaRoot = opf.getMetadataRoot();

    // fetch the identifier(s)
    var IDs = metaRoot.findElements("http://purl.org/dc/elements/1.1/", "identifier");
    for ( var t=0; t<IDs.length; t++ ) {
        console.log("Identifier is " + IDs[t].getValue());
    }
    
    // fetch the title(s) (required)  directly
    var titles = metaRoot.findElements("http://purl.org/dc/elements/1.1/", "title");
    for ( var t=0; t<titles.length; t++ ) {
        console.log("Title is " + titles[t].getValue());
    }

    // then fetch the language(s)
    var langs = metaRoot.findElements("http://purl.org/dc/elements/1.1/", "language");
    for ( var l=0; l<langs.length; l++ ) {
        console.log("Language is " + langs[l].getValue());
    }

    // finally, fetch the modified time
    var modified = metaRoot.findMetaElements("http://purl.org/dc/terms/", "modified");
    for ( var m=0; m<modified.length; m++ ) {
        console.log("Modified time is " + modified[m].getValue());
    }
    
    // beyond this the app developer can simply walk the set of metadata elements and 
    // fetch the attributes, etc.
    
    /* add some examples here... */


    /*
     * Manipulating the page layout.  This is primarily about setting properties 
     * whcih are then consumed and executed by the page layout machinery in the 
     * RS implementation, so nothing very complex here. 
     *  
     * Note that the page layout properties are properties of the reading system, so 
     * they are read/set via the reading system itself via the implementation of the 
     * PageLayout interface 
     */

    // fetch the current renditon:layout property
    var layout = rs.getRenditionLayout();
    console.log("The layout is " + layout == REND_LAYOUT_PAGINATED ? "pre-paginated" : "relfowable");

    // user wants only  one-up, then if it isn't already set, then set it (just for example's sake)
    if (rs.getRenditionSpread() != REND_SPREAD_NONE) {
        rs.setRenditionSpread( REND_SPREAD_NONE );
    }

    // find out what the width of the usable area for page layout is
    var width = rs.getLayoutWidth();
    console.log("Layout area width is " + width + " pixels");

    // then set it to 760px.  Since layout width is about the display, width is always in pixels (?)
    rs.setLayoutWidth(760px);

    // set the gutterwidth (the gap between pages in a spread
    rs.setGutterWidth(50px);

    // get the currrent margin settings. These can be either <all>,  or <top right bottom left>
    var margins = rs.getMargins();
    console.log("Current margins: " + margins );

    // now set 4 different margins
    rs.setMargins( "1em 2em 3em 2em");

    /*
     * text rendering parameters.  Like page layout, these are simple properties for the 
     * most part that are handled by the implementation of the RS.  Also, like the PageLayout 
     * properties, they are accessed via the ReadingSystem, which must implement the 
     * TextRendering interface 
     */

    // search
 
    // highlights
    
    // media overlays

    // exit the app

    // re-open the book with saved settings


    
    
    
    
    
    
      

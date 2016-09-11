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

    // fetch the metadata

    // manipulate the page layout


    // set some text rendering parameters

    // search
 
    // highlights
    
    // media overlays

    // exit the app

    // re-open the book with saved settings


    
    
    
    
    
    
      

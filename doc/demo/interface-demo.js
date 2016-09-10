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
    rs.openEPUB("MobyDick.epub");

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

    // some navigation examples.  Normally, these would be in some type of event loop 
    // but these just show how it might be done

    // just go to the next screen
    rs.nextScreen();

    // jump to the end of the document
    rs.endDocument();

    // pop the previous location from the stack and go there (back button behaviour)
    var loc = rs.getPreviousLocation();
    rs.gotoLocation( loc );

    // enumerate the NavDoc

    // fetch the metadata

    // manipulate the page layout


    // set some text rendering parameters

    // search
 
    // highlights
    
    // media overlays

    // exit the app

    // re-open the book with saved settings


    
    
    
    
    
    
      

//    var addStyleRule = ( function ( domStyle ){
//
//        if ( domStyle.addRule ) {
//
//            return function( selector, styleRule ) {
//                domStyle.addRule( selector, styleRule );
//            }
//
//        } else {
//
//            return function( selector, styleRule ) {
//                domStyle.insertRule( selector + "{" + styleRule + "}", domStyle.length )
//            }
//
//        }
//    } )( styles[ 'undefined' !== typeof styles.sheet ? 'sheet' : 'undefined' !== typeof styles.getSheet ? 'getSheet' : 'styleSheet' ] );




var compat = (function () {

    var check           = document.createElement( 'style' )
    ,   DOMStyle        = 'undefined' !== typeof check.sheet ? 'sheet' : undefined !== check.getSheet ? 'getSheet' : 'styleSheet'
    ,   scopeSupported  = undefined !== check.scoped
    ,   testSheet
    ,   DOMRules
    ,   testStyle
    ,   DOMParentSheet
    ;

    // we need to append it to the DOM because the DOM element at least FF keeps NULL as a sheet utill appended
    // and we can't check for the rules / cssRules and changeSelectorText untill we have that
    document.body.appendChild( check );
    testSheet           = check[ DOMStyle ];

    // add a test styleRule to be able to test selectorText changing support
    // IE doesn't allow inserting of '' as a styleRule
    testSheet.addRule ? testSheet.addRule( 'c', 'blink' ) : testSheet.insertRule( 'c{}', 0 );

    // store the way to get to the list of rules
    DOMRules            = testSheet.rules ? 'rules' : 'cssRules';

    // cache the test rule (its allways the first since we didn't add any other thing inside this <style>
    testStyle           = testSheet[ DOMRules ][ 0 ];

    // try catch it to prevent IE from throwing errors
    // can't check the read-only flag since IE just throws errors when setting it and Firefox won't allow setting it (and has no read-only flag
    try{
        testStyle.selectorText = 'd';
    }catch( e ){}

    // check if the selectorText has changed to the value we tried to set it to
    // toLowerCase() it to account for browsers who change the text
    var changeSelectorTextAllowed = 'd' === testStyle.selectorText.toLowerCase();

    // remove the <style> to clean up
    check.parentNode.removeChild( check );

    // return the object with the appropriate flags
    return {
        scopeSupported: scopeSupported
    ,   rules: DOMRules
    ,   sheet: DOMStyle
    ,   parent: DOMParentSheet
    ,   changeSelectorTextAllowed: changeSelectorTextAllowed
    };
} ) ();


console.log( "changeSelectorTextAllowed: ", compat.changeSelectorTextAllowed );



var highest                 = 0
,   stylesSplitter          = /\s*;\s*/
,   styleSplitter           = /\s*:(?!\/)\s*/
,   selectorSplitter        = /\s*,\s*/
,   importantSpecificity    = /!important/g
,   idSpecificity           = /#[a-zA-Z0-9-_]+/g
,   classSpecificity        = /(\.|:)[a-zA-Z0-9-_]+/g
,   elementSpecificity      = /\s*[a-zA-Z0-9-_]+/g
;

function Selector( selectorText ) {

    if ( !this instanceof Selector ) {
        return new Selector( selectorText );
    }

    this.selectorText   = selectorText;
    this.specificity    = undefined;
    this.style          = undefined;

    return this;
}

Selector.prototype.addStyle = function ( style ) {
    if ( !style ) {
        return undefined;
    }

    this.style = style;

    this.calculateSpecificity();

    return this;
};

Selector.prototype.replace = function( ) {

     this.selectorText = String.prototype.replace.apply( this.selectorText, arguments );

};

Selector.prototype.calculateSpecificity = function () {

    var str = this.selectorText;

    var imp = str.match( importantSpecificity );

    if ( imp ) {
        str = str.replace( importantSpecificity, ' ' );
    }

    var ids  = str.match( idSpecificity );
    if ( ids ) {
        str = str.replace( idSpecificity, ' ' );
    }

    var classes = str.match( classSpecificity );
    if ( classes ) {
        str = str.replace( classSpecificity, ' ' );
    }

    var elements = str.match( elementSpecificity );

    this.specificity = [
        imp         ? imp.length        : 0
    ,   ids         ? ids.length        : 0
    ,   classes     ? classes.length    : 0
    ,   elements    ? elements.length   : 0
    ].concat( this.style.domPosition );
};

Selector.prototype.getSpecificity = function () {

    if ( !this.specificity ) {
        this.calculateSpecificity();
    }

    return this.specificity;
};

Selector.prototype.compareSpecificity = function ( _a, _b ) {

    var a
    ,   b
    ,   aSpec
    ,   bSpec
    ;

    if ( !_a && !_b ) {

        return this;

    } else if ( !_b ) {

        b = _a;
        a = this;

    } else {

        a = _a;
        b = _b;

    }

    aSpec = a.getSpecificity();
    bSpec = b.getSpecificity();

    for ( var i = 0, len = aSpec.length; i < len; i++  ) {

        if ( aSpec[ i ] !== bSpec[ i ] ) {

            if ( aSpec[ i ] > bSpec[ i ] ) {
                return _b ? -1 :  this;
            } else {
                return _b ? 1 : _a;
            }
        }
    }
    return _b ? 0 : this;
};

Selector.prototype.toString = function () {

    return this.selectorText;

};



function Style ( params ) {

    if ( !this instanceof Style ) {
        return new Selector( params );
    }

    this.domStyle       = undefined;
    this.rules          = [];
    this.sheet          = params.sheet;
    this.selectors      = [];
    this.properties     = [];
    this.domPosition    = 'undefined' !== typeof params.sheetCounter && 'undefined' !== typeof  params.styleCounter ? [ params.sheetCounter, params.styleCounter ] : [ 0, 0 ];
    if ( params.sheet[ compat.rules ][ params.styleCounter ] ) {
        this.fillStyle( params.sheet[ compat.rules ][ params.styleCounter ] );
    }

    return this;

}

Style.prototype.addSelector = function ( selector ) {

    this.selectors.push( selector );
    return this;

};

Style.prototype.getSelectors = function () {

    return this.selectors;

};

Style.prototype.removeAndInsert = function() {

    var selector    = this.selectors.join( ', ' )
    ,   styleRule   = "" + this
    ;

    output.innerHTML += this.domPosition[ 0 ] +','+ this.domPosition[ 1 ] /* selector + ' : '+ styleRule */ + '<br />';

    // addRule and removeRule are IE specific, IE doesn't allow inserting of a rule at an index, it always adds it to the end of the stack
    // insertRule and deleteRule are Gecko specific
    //
    this.sheet.addRule    ? this.sheet.addRule( selector, styleRule )      : this.sheet.insertRule( selector + '{' + styleRule + '}', this.domPosition[ 1 ] );
    this.sheet.removeRule ? this.sheet.removeRule( this.domPosition[ 1 ] ) : this.sheet.deleteRule( this.domPosition[ 1 ] );

};

Style.prototype.changeSelectors = (function( support ) {

    if ( support ) {

        return function( newSelector ) {
            this.domStyle.selectorText = this.selectors.join( ', ' );
        };

    } else {

        return function( newSelector ) {
            this.removeAndInsert();
        };

    }
} ) ( compat.changeSelectorTextAllowed );

Style.prototype.replaceInSelectors = function( from, to ) {

    var selectors = this.getSelectors()
    ,   i = 0
    ,   curSelector
    ;

    while ( ( curSelector = selectors[ i ] ) ) {
        curSelector.replace( from, to );
        i += 1;
    }

    this.changeSelectors();
    return this;

};

Style.prototype.fillStyle = function ( domStyle ) {

    if ( !domStyle ){
        return;
    }

    var cssTextArray
    ,   selectorsArray
    ,   styles       = domStyle.style
    ,   tempCssText
    ;

    this.domStyle   = domStyle;
    this.rules      = {};
    this.selectors  = [];
    this.properties = [];

    cssTextArray = styles.cssText.split( stylesSplitter );
    cssTextArray.pop();

    for ( var i = 0, len = cssTextArray.length; i < len; i++ ) {

        tempCssText = cssTextArray[ i ].split( styleSplitter );
        this.rules[ tempCssText[ 0 ] ] = tempCssText[ 1 ];

    }

    for ( var i = 0, len = styles.length; i < len; i++ ) {
        this.properties.push( styles[ i ] )
    }

    selectorsArray = domStyle.selectorText ? domStyle.selectorText.split( selectorSplitter ) : [ domStyle.cssText.split( '{' )[ 0 ] ];
    for ( var i = 0, len = selectorsArray.length; i < len; i++ ) {
        this.addSelector( new Selector( selectorsArray[ i ] ).addStyle( this ) );
    }

    return this;

};

Style.prototype.toString = function() {

    return this.domStyle.style.cssText;

};


window.onload = function () {

    var styleSheets
    ,   sheetSelector
    ,   allStyles               = []
    ,   allSelectors            = []
    ,   DOMSheet
    ,   ruleSelector
    ,   DOMStyles
    ,   sheet
    ;

    if ( document.querySelectorAll ) {

        styleSheets =  document.querySelectorAll( "link[rel='stylesheet'], style" );

    } else {

        styleSheets = ( function () {

            var links   = document.getElementsByTagName( 'link'  )
            ,   styles  = document.getElementsByTagName( 'style' )
            ,   ar      = []
            ,   i
            ;
            for ( i = 0, len = links.length; i < len; i++ ) {
                ar.push( links[ i ] );
            }

            for ( i = 0, len = styles.length; i < len; i++ ) {
                ar.push( styles[ i ] );
            }

            return ar;

        } ) ();

    }

    if ( !styleSheets || !styleSheets.length ) {
        return;
    }

    for ( var i = 0, len = styleSheets.length; i < len; i++ ) {

        sheet = styleSheets[ i ];

        DOMSheet = sheet[ compat.sheet ];

        DOMStyles = DOMSheet[ compat.rules ];

        for ( var j = 0, len2 = DOMStyles.length; j < len2; j++ ) {

            var current         = DOMStyles[ j ];

            if ( current && ( !current.type || 1 === current.type ) ) {

                var cur = new Style( {
                    sheet: DOMSheet
                ,   sheetCounter: i
                ,   styleCounter: j
                } );

                allStyles.push( cur );
                Array.prototype.push.apply( allSelectors, cur.getSelectors() );

            }
        }
    }

    allSelectors.sort( Selector.prototype.compareSpecificity );
    console.log( allSelectors );

    //allStyles.reverse()

    console.log(  "allSelectors.length: ", allSelectors.length );
    console.log( "allStyles.length: " , allStyles.length );

    window.allSelectors = allSelectors;
    window.allStyles = allStyles;

    for ( var a = 0, aLen = allStyles.length; a < aLen; a++ ) {

        //allStyles[ a ].replaceInSelectors( /li(?!\w)/gi, '.li' )
        //output.innerHTML += allStyles[ a ] + '<br />'

        //console.log( allStyles[ a ] );
    }
    // ?javascript:(function(doc){doc.body.appendChild(doc.createElement("scr"+"ipt")).setAttribute("src","http://localhost.test.nl/PM5544/cssInfo.js")})(document)
}


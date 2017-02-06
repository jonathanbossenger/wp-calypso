/**
 * External dependencies
 */
import debugFactory from 'debug';
import tinymce from 'tinymce/tinymce';
import { recordTracksEvent } from 'state/analytics/actions';

const debug = debugFactory( 'calypso:tinymce-plugins:wpcom-paste-track' );

const SOURCE_GOOGLE_DOCS = 'google_docs';
const SOURCE_UNKNOWN = 'unknown';

function trackPaste( editor ) {
	debug( 'init' );

	const store = editor.getParam( 'redux_store' );
	if ( ! store ) {
		debug( 'store not found, do not bind events' );
		return;
	}

	/**
	 * Records the event.
	 *
	 * @param {String} mode - 'html-editor' or 'visual-editor', indicates which editor was in use on paste.
	 * @param {(Array|DOMStringList)} types - The types the content is available to paste.
	 */
	function recordPasteEvent( mode, types ) {
		debug( 'track paste event ' );
		const typesStr = toString( types );
		store.dispatch( recordTracksEvent( 'calypso_editor_content_paste', {
			mode,
			types: typesStr,
			source: getSource( typesStr )
		} ) );
	}

	function isGoogleDocs( types ) {
		return ( types.indexOf( 'application/x-vnd.google-docs-image-clip+wrapped' ) > -1 ) ||
		( types.indexOf( 'application/x-vnd.google-docs-document-slice-clip+wrapped' ) > -1 );
	}

	function getSource( types ) {
		if ( isGoogleDocs( types ) ) {
			return SOURCE_GOOGLE_DOCS;
		}
		return SOURCE_UNKNOWN;
	}

	/**
	 *
	 * Although types should be an array, some browsers -as Firefox- will pass a DOMStringList instead.
	 * We need coverage for thoses cases, hence this function and the Array.from conversion.
	 *
	 * More info at:
	 *
	 * - types at https://html.spec.whatwg.org/multipage/interaction.html#datatransfer
	 * - DOMStringList at https://developer.mozilla.org/en-US/docs/Web/API/DOMStringList
	 *
	 * @param {(Array|DOMStringList)} types - array of available types
	 * @returns {String} A string containing the values in types, separated by commas.
	 */
	function toString( types ) {
		return Array.from( types ).join( ', ' );
	}

	function onPasteFromTinyMCEEditor( event ) {
		recordPasteEvent( 'visual-editor', event.clipboardData.types );
	}

	function onPasteFromHTMLEditor( event ) {
		recordPasteEvent( 'html-editor', event.clipboardData.types );
	}

	debug( 'bind listeners for paste event' );
	editor.on( 'paste', onPasteFromTinyMCEEditor );
	const textarea = editor.getParam( 'textarea' );
	if ( textarea ) {
		textarea.addEventListener( 'paste', onPasteFromHTMLEditor );
	}

	editor.on( 'remove', () => {
		debug( 'unbind listeners for paste event on editor removal' );
		editor.off( 'paste', onPasteFromTinyMCEEditor );
		textarea.removeEventListener( 'paste', onPasteFromHTMLEditor );
	} );
}

export default () => {
	debug( 'load' );
	tinymce.PluginManager.add( 'wpcom/trackpaste', trackPaste );
};

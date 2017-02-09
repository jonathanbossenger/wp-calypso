/**
 * Internal dependencies
 */
import {
	WPCOM_HTTP_REQUEST,
	WPCOM_HTTP_BAD_REQUEST,
} from 'state/action-types';
import warn from 'lib/warn';

export const apiVersionRegex = new RegExp( /^v(?:(\d+)\.)?(\d+)$/ );
export const apiNamespaceRegex = new RegExp( /^(?:([a-z]+)\/)?v(\d+)$/ );

const badRequest = description => {
	warn( `wpcom-http error: ${ description }` );

	return {
		type: WPCOM_HTTP_BAD_REQUEST,
		error: 'request parameters object is not valid',
		description
	};
};

/**
 * Returns a valid WordPress.com API HTTP Request action object
 *
 * @param {string} [apiVersion] specific API version for request
 * @param {string} [apiNamespace] specific API namespace for request
 * @param {Object} [body] JSON-serializable body for POST requests
 * @param {string} method name of HTTP method to use
 * @param {string} path WordPress.com API path with %s and %d placeholders, e.g. /sites/%s
 * @param {Object} [query] key/value pairs for query string
 * @param {FormData} [formData] key/value pairs for POST body, encoded as "multipart/form-data"
 * @param {Object} [onSuccess] Redux action to call when request succeeds
 * @param {Object} [onFailure] Redux action to call when request fails
 * @param {Object} [onProgress] Redux action to call on progress events from an upload
 * @param {Object} [options] extra options to send to the middleware, e.g. retry policy or offline policy
 * @param {Object} [action] default action to call on HTTP events
 * @return {Object} Redux action describing WordPress.com API HTTP request
 */
export const http = ( {
	apiVersion,
	apiNamespace,
	body = {},
	method,
	path,
	query = {},
	formData,
	onSuccess,
	onFailure,
	onProgress,
	...options,
}, action = null ) => {
	const actionProperties = {
		body,
		onSuccess: onSuccess || action,
		onFailure: onFailure || action,
		onProgress: onProgress || action,
		query: { ...query },
	};

	// * check parameters *

	// `path` is not optional and it is a string
	// `method` is not optional and its value can take either 'GET' or 'POST`
	if ( ! path || typeof path !== 'string' ) {
		return badRequest( `'path: ${ path }' param is invalid.` );
	}

	if ( ! method || ( method !== 'GET' && method !== 'POST' ) ) {
		return badRequest( `'method: ${ method }' param is invalid.` );
	}

	// - One of `apiVersion` of `apiNamespace` should be defined
	if ( typeof apiVersion === 'undefined' && typeof apiNamespace === 'undefined' ) {
		return badRequest( 'One of `apiVersion` or `apiNamespace` params must be defined.' );
	}

	// - `apiVersion` and `apiNamespace` cannot be defined simultaneously
	if ( typeof apiVersion !== 'undefined' && typeof apiNamespace !== 'undefined' ) {
		return badRequest( '`apiVersion` or `apiNamespace` params cannot be defined simultaneously.' );
	}

	// - `apiVersion` must have the `v1, v1.1, v2, v2.1, ...` shape
	if ( typeof apiVersion !== 'undefined' ) {
		if ( apiVersionRegex.test( apiVersion ) ) {
			actionProperties.query.apiVersion = apiVersion;
		} else {
			return badRequest( `'apiVersion: ${ apiVersion }' param is invalid.` );
		}
	}

	// - `apiNamesapce` must have the `wp/v2, wpcom/v2, ...` shape
	if ( typeof apiNamespace !== 'undefined' ) {
		if ( /^[a-z]+\/v\d+/.test( apiNamespace ) ) {
			actionProperties.query.apiNamespace = apiNamespace;
		} else {
			return badRequest( `'apiNamespace: ${ apiNamespace }' param is invalid.` );
		}
	}

	// optional parameters
	if ( typeof formData !== 'undefined' ) {
		actionProperties.formData = [];
	}

	return {
		...actionProperties,
		...options,
		type: WPCOM_HTTP_REQUEST,
		path,
		method,
		body,
	};
};

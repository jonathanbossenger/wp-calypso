/**
 * External dependencies
 */
import { expect } from 'chai';

/**
 * Internal dependencies
 */
import {
	WPCOM_HTTP_REQUEST,
	WPCOM_HTTP_BAD_REQUEST,
} from 'state/action-types';

/**
 * Internal dependencies
 */
import {
	apiVersionRegex,
	apiNamespaceRegex,
	http
} from '../actions';

describe( 'http', () => {
	describe( 'apiVersion shape', () => {
		it.only( 'should not accept `1` as a valid version value', () => {
			expect( apiVersionRegex.test( '1' ) ).to.be.false;
		} );

		it.only( 'should accept `v1` as a valid version value', () => {
			expect( apiVersionRegex.test( 'v1' ) ).to.be.true;
		} );

		it.only( 'should not accept `v1.` as a valid version value', () => {
			expect( apiVersionRegex.test( 'v1.' ) ).to.be.false;
		} );

		it.only( 'should accept `v1.3` as a valid version value', () => {
			expect( apiVersionRegex.test( 'v1.3' ) ).to.be.true;
		} );
	} );

	describe( 'apiNamespace shape', () => {
		it.only( 'should not accept `wpcom` as a valid version value', () => {
			expect( apiNamespaceRegex.test( 'wpcom' ) ).to.be.false;
		} );

		it.only( 'should accept `wpcom/v1` as a valid version value', () => {
			expect( apiNamespaceRegex.test( 'wpcom/v1' ) ).to.be.true;
		} );

		it.only( 'should not accept `wpcom/` as a valid version value', () => {
			expect( apiNamespaceRegex.test( 'wpcom/' ) ).to.be.false;
		} );

		it.only( 'should not accept `wpcom/1` as a valid version value', () => {
			expect( apiNamespaceRegex.test( 'wpcom/1' ) ).to.be.false;
		} );
	} );

	describe( 'request action', () => {
		it( 'should return a valid redux action defining apiVersion', () => {
			const action = http( {
				apiVersion: 'v2',
				method: 'GET',
				path: '/path/to/endpoint',
			} );

			expect( action ).to.eql( {
				type: WPCOM_HTTP_REQUEST,
				body: {},
				method: 'GET',
				path: '/path/to/endpoint',
				query: {
					apiVersion: 'v2'
				},
				onSuccess: null,
				onFailure: null,
				onProgress: null,
			} );
		} );

		it( 'should return a valid redux action defining apiNamespace', () => {
			const action = http( {
				apiNamespace: 'wpcom/v2',
				method: 'GET',
				path: '/path/to/endpoint',
			} );

			expect( action ).to.eql( {
				type: WPCOM_HTTP_REQUEST,
				body: {},
				method: 'GET',
				path: '/path/to/endpoint',
				query: {
					apiNamespace: 'wpcom/v2'
				},
				onSuccess: null,
				onFailure: null,
				onProgress: null,
			} );
		} );

		it( 'should return a valid redux action passing random parameters into the query', () => {
			const action = http( {
				apiVersion: 'v2',
				method: 'GET',
				path: '/path/to/endpoint',
				query: {
					number: 10,
					context: 'display',
					fields: [ 'foo', 'bar' ],
				}
			} );

			expect( action ).to.eql( {
				type: WPCOM_HTTP_REQUEST,
				body: {},
				method: 'GET',
				path: '/path/to/endpoint',
				query: {
					apiVersion: 'v2',
					number: 10,
					context: 'display',
					fields: [ 'foo', 'bar' ],
				},
				onSuccess: null,
				onFailure: null,
				onProgress: null,
			} );
		} );
	} );

	describe( 'bad request action', () => {
		it( 'should return a bad action when `apiVersion` is not defined', () => {
			const action = http( {
				path: '/path/to/endpoint',
				method: 'GET',
			} );

			expect( action ).to.eql( {
				type: WPCOM_HTTP_BAD_REQUEST,
				error: 'request parameters object is not valid'
			} );
		} );

		it( 'should return a bad action when `path` is not defined', () => {
			const action = http( {
				apiVersion: 'v1',
				method: 'GET',
			} );

			expect( action ).to.eql( {
				type: WPCOM_HTTP_BAD_REQUEST,
				error: 'request parameters object is not valid'
			} );
		} );

		it( 'should return a bad action when `path` is invalid', () => {
			const action = http( {
				apiVersion: 'v1',
				method: 'GET',
				path: true,
			} );

			expect( action ).to.eql( {
				type: WPCOM_HTTP_BAD_REQUEST,
				error: 'request parameters object is not valid'
			} );
		} );

		it( 'should return a bad action when method is not defined', () => {
			const action = http( {
				apiVersion: 'v1',
				path: '/path/to/endpoint',
			} );

			expect( action ).to.eql( {
				type: WPCOM_HTTP_BAD_REQUEST,
				error: 'request parameters object is not valid'
			} );
		} );

		it( 'should return a bad action when method is unknown', () => {
			const action = http( {
				apiVersion: 'v1',
				method: 'PUT',
				path: '/path/to/endpoint',
			} );

			expect( action ).to.eql( {
				type: WPCOM_HTTP_BAD_REQUEST,
				error: 'request parameters object is not valid'
			} );
		} );

		it( 'should return a bad action when apiVersion is invalid', () => {
			const action = http( {
				apiVersion: 'version1',
				method: 'PUT',
				path: '/path/to/endpoint',
			} );

			expect( action ).to.eql( {
				type: WPCOM_HTTP_BAD_REQUEST,
				error: 'request parameters object is not valid'
			} );
		} );

		it( 'should return a bad action when apiNamespace is invalid', () => {
			const action = http( {
				apiNamespace: 'v1',
				method: 'PUT',
				path: '/path/to/endpoint',
			} );

			expect( action ).to.eql( {
				type: WPCOM_HTTP_BAD_REQUEST,
				error: 'request parameters object is not valid'
			} );
		} );

		it( 'should return a bad action when both apiVersion and apiNamespace are simultaneously defined', () => {
			const action = http( {
				apiVersion: 'v1',
				apiNamespace: 'wpcom/v2',
				method: 'PUT',
				path: '/path/to/endpoint',
			} );

			expect( action ).to.eql( {
				type: WPCOM_HTTP_BAD_REQUEST,
				error: 'request parameters object is not valid'
			} );
		} );
	} );
} );

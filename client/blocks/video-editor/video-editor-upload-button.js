/**
 * External dependencies
 */
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { noop } from 'lodash';
import classNames from 'classnames';

/**
 * Internal dependencies
 */
import { VideoPressFileTypes } from 'lib/media/constants';

class VideoEditorUploadButton extends Component {
	static propTypes = {
		className: PropTypes.string,
		onUploadImage: PropTypes.func,
	};

	static defaultProps = {
		onUploadImage: noop,
	};

	constructor( props ) {
		super( props );
	}

	render() {
		const classes = classNames( 'video-editor__upload-button', this.props.className );

		return (
			<form ref="form" className={ classes }>
				<span>{ this.props.children }</span>
				<input
					type="file"
					accept={ VideoPressFileTypes }
					onChange={ this.onUploadImage }
					className="video-editor__upload-button-input" />
			</form>
		);
	}
}

export default connect()( VideoEditorUploadButton );

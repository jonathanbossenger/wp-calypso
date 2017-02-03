/**
 * External dependencies
 */
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { localize } from 'i18n-calypso';
import classNames from 'classnames';

/**
 * Internal dependencies
 */
import QuerySites from 'components/data/query-sites';
import DetailPreviewVideo from 'post-editor/media-modal/detail/detail-preview-video';
import VideoEditorButtons from './video-editor-buttons';

class VideoEditor extends Component {
	constructor( props ) {
		super( props );
	}

	handleCancel() {}

	handleSelectFrame() {}

	handleUploadImage() {}

	render() {
		const {
			className,
			media,
			siteId,
			translate,
		} = this.props;

		const classes = classNames(
			'video-editor',
			className
		);

		return (
			<div className={ classes }>
				<QuerySites siteId={ siteId } />

				<figure>
					<div className="video-editor__content">
						<div className="video-editor__preview-wrapper">
							<DetailPreviewVideo
								item={ media }
							/>
						</div>
						<span className="video-editor__text">
							{ translate( 'Select a frame to use as the thumbnail image or upload your own.' ) }
						</span>
						<VideoEditorButtons
							onCancel={ this.handleCancel }
							onSelectFrame={ this.handleSelectFrame }
							onUploadImage={ this.handleUploadImage }
						/>
					</div>
				</figure>
			</div>
		);
	}
}

VideoEditor.propTypes = {
	// Component props
	className: PropTypes.string,
	media: PropTypes.object,
	siteId: PropTypes.number,

	// Redux props
	translate: PropTypes.func,
};

VideoEditor.defaultProps = {
	media: null,
};

export default connect()( localize( VideoEditor ) );

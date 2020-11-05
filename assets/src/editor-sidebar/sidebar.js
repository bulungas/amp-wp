/**
 * External dependencies
 */
import PropTypes from 'prop-types';

/**
 * WordPress dependencies
 */
import { useSelect } from '@wordpress/data';
import { PanelBody } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { MODULE_KEY } from '../../block-validation/store';
import './style.css';
import { useBackendData } from './use-backend-data';

/**
 * Component rendering an icon representing JS, CSS, or HTML.
 *
 * @param {Object} props
 * @param {string} props.type The error type.
 */
function ErrorTypeIcon( { type } ) {
	const { CSS_ERROR_TYPE, HTML_ATTRIBUTE_ERROR_TYPE, HTML_ELEMENT_ERROR_TYPE, JS_ERROR_TYPE } = useBackendData();

	switch ( type ) {
		case HTML_ATTRIBUTE_ERROR_TYPE:
		case HTML_ELEMENT_ERROR_TYPE:
			return (
				<svg width="15" height="5" viewBox="0 0 15 5" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M3.17504 2.32461H1.37504V0.724609H0.641708V4.72461H1.37504V2.99128H3.17504V4.72461H3.90838V0.724609H3.17504V2.32461ZM4.44171 1.45794H5.57504V4.72461H6.30837V1.45794H7.44171V0.724609H4.44171V1.45794ZM10.775 0.724609L9.77504 2.52461L8.84171 0.724609H8.24171L7.70837 4.72461H8.44171L8.77504 2.05794L9.77504 3.92461L10.775 2.05794L11.1084 4.72461H11.8417L11.3084 0.724609H10.775ZM13.3084 4.05794V0.724609H12.575V4.72461H14.975V4.05794H13.3084Z" fill="white" />
				</svg>
			);

		case JS_ERROR_TYPE:
			return (
				<svg width="12" height="9" viewBox="0 0 12 9" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M3.67502 0.958984H5.17502V5.85898C5.17502 6.35898 5.07502 6.75898 4.87502 7.05898C4.67502 7.35898 4.37503 7.65898 4.07503 7.85898C3.67503 8.05898 3.27503 8.15898 2.87503 8.15898C2.07503 8.15898 1.57503 7.95898 1.07503 7.55898C0.675025 7.15898 0.475025 6.65898 0.475025 5.95898H1.97503C1.97503 6.25898 2.07502 6.55898 2.17502 6.75898C2.27503 6.95898 2.57503 6.95898 2.87503 6.95898C3.17503 6.95898 3.37503 6.85898 3.57503 6.65898C3.77503 6.45898 3.77503 6.15898 3.77503 5.85898V0.958984H3.67502Z" fill="white" />
					<path d="M10.075 6.25937C10.075 5.95937 9.97503 5.75938 9.77503 5.65938C9.57503 5.55938 9.27502 5.35938 8.67502 5.15938C8.17502 4.95938 7.77503 4.85938 7.47503 4.65938C6.67503 4.25938 6.27503 3.65937 6.27503 2.85938C6.27503 2.45938 6.37503 2.15937 6.57503 1.85938C6.77503 1.55937 7.07503 1.35937 7.47503 1.15937C7.97503 0.959375 8.47503 0.859375 8.97503 0.859375C9.47503 0.859375 9.97502 0.959375 10.375 1.15937C10.775 1.35937 11.075 1.55937 11.275 1.95937C11.475 2.25937 11.575 2.65937 11.575 3.05937H10.075C10.075 2.75937 9.97503 2.45937 9.77503 2.25937C9.57503 2.05937 9.27502 1.95937 8.87502 1.95937C8.47502 1.95937 8.27503 2.05937 8.07503 2.15937C7.87503 2.35937 7.77503 2.45937 7.77503 2.75937C7.77503 2.95937 7.87503 3.15937 8.07503 3.35938C8.27503 3.55938 8.67503 3.65937 9.07503 3.75937C9.87503 4.05937 10.475 4.35938 10.875 4.65938C11.275 4.95938 11.475 5.45937 11.475 6.05937C11.475 6.65937 11.275 7.15937 10.775 7.45937C10.275 7.85937 9.67502 7.95937 8.87502 7.95937C8.37502 7.95937 7.87502 7.85938 7.37502 7.65938C6.97502 7.45938 6.57502 7.15938 6.37502 6.85938C6.17502 6.55937 5.97503 6.05938 5.97503 5.65938H7.47503C7.47503 6.45938 7.97502 6.85938 8.87502 6.85938C9.17502 6.85938 9.47502 6.75938 9.67502 6.65938C9.97502 6.65938 10.075 6.45937 10.075 6.25937Z" fill="white" />
				</svg>
			);

		case CSS_ERROR_TYPE:
			return (
				<svg width="8" height="9" viewBox="0 0 8 9" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M4.13 6.45937H2.93001L2.53 8.85938H1.43L1.83 6.45937H0.530005V5.45937H2.03L2.33 3.75937H1.03V2.75937H2.53L2.93001 0.359375H4.03L3.63 2.75937H4.73L5.13 0.359375H6.23L5.83 2.75937H7.13V3.75937H5.63L5.33 5.45937H6.63V6.45937H5.13L4.73 8.85938H3.63L4.13 6.45937ZM3.13 5.45937H4.23L4.53 3.75937H3.43001L3.13 5.45937Z" fill="white" />
				</svg>
			);

		default:
			return null;
	}
}
ErrorTypeIcon.propTypes = {
	type: PropTypes.string.isRequired,
};

function PanelTitle( { title } ) {
	return (
		<span className="amp-error__title-text" dangerouslySetInnerHTML={ { __html: title } } />
	);
}
PanelTitle.propTypes = {
	title: PropTypes.string.isRequired,
};

function PanelTitleForBlock( { clientId, title, type } ) {
	const { block, blockType } = useSelect( ( select ) => {
		const blockDetails = select( 'core/block-editor' ).getBlock( clientId );
		const blockTypeDetails = select( 'core/blocks' ).getBlockType( blockDetails.name );

		return {
			block: blockDetails,
			blockType: blockTypeDetails,
		};
	}, [ clientId ] );

	const post = useSelect( ( select ) => select( 'core/editor' ).getCurrentPost() );

	console.log( post );

	return (
		<>
			<div className="amp-error__icons">
				<div className="amp-error__error-type-icon">
					<ErrorTypeIcon type={ type } />
				</div>
				{ blockType?.icon?.src && (
					<div className="amp-error__block-type-icon">
						{ blockType.icon.src }
					</div>
				) }
			</div>
			<PanelTitle title={ title } />
		</>
	);
}
PanelTitleForBlock.propTypes = {
	clientId: PropTypes.string,
	title: PropTypes.string.isRequired,
	type: PropTypes.string.isRequired,
};

function Error( { clientId, title, type } ) {
	return (
		<li>
			<PanelBody
				className="amp-error"
				title={ clientId
					? <PanelTitleForBlock clientId={ clientId } title={ title } type={ type } />
					: <PanelTitle title={ title } type={ type } />
				}
				initialOpen={ false }
			>
				{ 'content' }
			</PanelBody>
		</li>
	);
}
Error.propTypes = {
	clientId: PropTypes.string,
	title: PropTypes.string.isRequired,
	type: PropTypes.string.isRequired,
};

export function Sidebar() {
	const { validationErrors, isDirty } = useSelect( ( select ) => ( {
		validationErrors: select( MODULE_KEY ).getValidationErrors(),
		isDirty: select( 'core/editor' ).isEditedPostDirty(),
	} ) );

	console.log( validationErrors );
	return (
		<>
			<PanelBody opened={ true }>
				<p>
					<strong>
						{ __( 'Validation Errors', 'amp' ) }
					</strong>
				</p>
			</PanelBody>
			<ul>
				{ validationErrors.map( ( validationError, index ) => (
					<Error { ...validationError } key={ `${ validationError.clientId }${ index }` } />
				) ) }
			</ul>
		</>
	);
}

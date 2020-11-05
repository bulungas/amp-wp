/**
 * WordPress dependencies
 */
import { useSelect } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { MODULE_KEY } from '../../block-validation/store';

function IconSVG() {
	return (
		<svg width="21" height="21" viewBox="0 0 21 21" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
			<path fillRule="evenodd" clipRule="evenodd" d="M0.377197 10.6953C0.377197 16.1953 4.8772 20.6953 10.3772 20.6953C15.8772 20.6953 20.3772 16.1953 20.3772 10.6953C20.3772 5.19531 15.8772 0.695312 10.3772 0.695312C4.8772 0.695312 0.377197 5.19531 0.377197 10.6953Z" />
			<path d="M9.5772 16.7953H8.8772L9.6772 12.2953H7.3772C7.1772 12.2953 6.9772 12.0953 6.9772 11.8953C6.9772 11.7953 7.0772 11.6953 7.0772 11.6953L11.2772 4.69531H12.0772L11.2772 9.29531H13.5772C13.7772 9.29531 13.9772 9.49531 13.9772 9.69531C13.9772 9.79531 13.9772 9.89531 13.8772 9.89531L9.5772 16.7953ZM10.3772 0.695312C4.8772 0.695312 0.377197 5.19531 0.377197 10.6953C0.377197 16.1953 4.8772 20.6953 10.3772 20.6953C15.8772 20.6953 20.3772 16.1953 20.3772 10.6953C20.3772 5.19531 15.8772 0.695312 10.3772 0.695312Z" fill="white" />
		</svg>
	);
}

export function ToolbarIcon() {
	const { errorCount, isDirty } = useSelect( ( select ) => ( {
		errorCount: select( MODULE_KEY ).getValidationErrors().length,
		isDirty: select( 'core/editor' ).isEditedPostDirty(),
	} ) );

	return (
		<div className="amp-plugin-icon">
			<IconSVG />
			{ 0 < errorCount && (
				<div className="amp-error-count-badge">
					{ errorCount }
				</div>
			) }
		</div>
	);
}

export function MoreMenuIcon() {
	return <IconSVG />;
}

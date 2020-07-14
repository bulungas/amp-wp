/**
 * External dependencies
 */
import PropTypes from 'prop-types';

/**
 * WordPress dependencies
 */
import { useContext, useEffect, useState, useRef, Fragment } from '@wordpress/element';
import { __, sprintf, _n } from '@wordpress/i18n';
import { autop } from '@wordpress/autop';
import { format, dateI18n } from '@wordpress/date';
import apiFetch from '@wordpress/api-fetch';
import { SelectControl } from '@wordpress/components';
import { addQueryArgs } from '@wordpress/url';

/**
 * Internal dependencies
 */
import { Options } from '../components/options-context-provider';
import { ConditionalDetails } from '../components/conditional-details';
import { Selectable } from '../components/selectable';

/**
 * Renders the formatted date for when a plugin was suppressed.
 *
 * @param {Object} props
 * @param {Object} props.suppressedPlugin
 */
function SuppressedPluginTime( { suppressedPlugin } ) {
	const { editedOptions } = useContext( Options );
	const { date_format: dateFormat } = editedOptions;

	if ( ! suppressedPlugin || ! suppressedPlugin.timestamp || ! dateFormat ) {
		return null;
	}

	return (
		<time dateTime={ format( 'c', suppressedPlugin.timestamp ) }>
			{
				// Translators: placeholder is a formatted date.
				sprintf( __( 'Since %s.', 'amp' ), dateI18n( dateFormat, suppressedPlugin.timestamp * 1000 ) )
			}
			{ ' ' }
		</time>
	);
}
SuppressedPluginTime.propTypes = {
	suppressedPlugin: PropTypes.shape( {
		timestamp: PropTypes.number,
	} ),
};

/**
 * Renders the username of the WP user who suppressed a plugin.
 *
 * @todo Maybe pass this from the backend to avoid the extra apiFetch.
 * @todo The PHP version says "you" if the suppressing user is the current user.
 *
 * @param {Object} props Component props.
 * @param {Object} props.suppressedPlugin
 */
function SuppressedPluginUsername( { suppressedPlugin } ) {
	const [ fetchingSuppressingUser, setFetchingSuppressingUser ] = useState( true );
	const [ suppressingUser, setSuppressingUser ] = useState( null );
	const [ userFetchError, setUserFetchError ] = useState( null );

	const mounted = useRef( true );
	useEffect( () => () => {
		mounted.current = false;
	} );

	/**
	 * Fetch the user by username.
	 */
	useEffect( () => {
		if ( suppressingUser || ! suppressedPlugin.username ) {
			return;
		}

		( async () => {
			try {
				const fetchedSuppressingUser = await apiFetch( { path: addQueryArgs( '/wp/v2/users', { slug: suppressedPlugin.username } ) } );

				if ( ! mounted.current || ! Array.isArray( fetchedSuppressingUser ) || ! fetchedSuppressingUser.length ) {
					return;
				}

				setSuppressingUser( fetchedSuppressingUser[ 0 ] );
			} catch ( e ) {
				if ( ! mounted.current ) {
					return;
				}
				setUserFetchError( e );
			}

			setFetchingSuppressingUser( false );
		} )();
	}, [ suppressedPlugin.username, suppressingUser ] );

	if ( ! suppressedPlugin.username ) {
		return null;
	}

	if ( fetchingSuppressingUser || ! suppressedPlugin.username ) {
		return null;
	}

	if ( ! userFetchError ) {
		return (
			<span>

				{
					// Translators: placeholder is a username
					sprintf( __( 'Done by %s.', 'amp' ), suppressedPlugin.username )
				}
				{ ' ' }
			</span>
		);
	}

	return (
		<span>
			{
			// Translators: placeholder is a username
				sprintf( __( 'Done by %s.', 'amp' ), suppressingUser.name )
			}
			{ ' ' }
		</span> );
}
SuppressedPluginUsername.propTypes = {
	suppressedPlugin: PropTypes.shape( {
		timestamp: PropTypes.number,
		username: PropTypes.string,
	} ),
};

/**
 * Renders information about a suppressed plugin's version.
 *
 * @param {Object} props
 * @param {Object} props.pluginDetails
 * @param {Object} props.suppressedPlugin
 */
function SuppressedPluginVersion( { pluginDetails, suppressedPlugin } ) {
	if ( suppressedPlugin.last_version !== pluginDetails.Version ) {
		if ( pluginDetails.Version ) {
			return (
				<span>
					{
						sprintf(
							// Translators: both placeholders are plugin version numbers.
							__( 'Now updated to version %1$s since suppressed at %2$s.', 'amp' ),
							pluginDetails.Version,
							suppressedPlugin.last_version,
						)

					}
				</span>
			);
		}
		return __( 'Plugin updated since last suppressed', 'amp' );
	}

	return null;
}
SuppressedPluginVersion.propTypes = {
	pluginDetails: PropTypes.shape( {
		Version: PropTypes.string,
	} ),
	suppressedPlugin: PropTypes.shape( {
		last_version: PropTypes.string,
	} ),
};

/**
 * Renders the validation errors for a plugin that hasn't been suppressed.
 *
 * @param {Object} props
 * @param {Array} props.errors
 */
function ValidationErrorDetails( { errors } ) {
	return (
		<details>
			<summary>
				{
					sprintf(
						/* translators: %s is the error count */
						_n(
							'%s validation error',
							'%s validation errors',
							errors.length,
							'amp',
						),
						errors.length,
					)
				}
			</summary>
			<ul>
				{ errors.map( ( error ) => {
					const className = [
						`error-${ error.is_removed ? 'removed' : 'kept' }`,
						`error-${ error.is_reviewed ? 'reviewed' : 'unreviewed' }`,
					].join( ' ' );

					const WrapperElement = 'is_reviewed' ? 'strong' : Fragment;

					return (
						<li key={ error.term.term_id } className={ className }>
							<WrapperElement>
								<a href={ error.edit_url } target="_blank" rel="noreferrer">
									<span dangerouslySetInnerHTML={ { __html: error.title } } />
								</a>
							</WrapperElement>
						</li>
					);
				} ) }
			</ul>
		</details>
	);
}
ValidationErrorDetails.propTypes = {
	errors: PropTypes.array,
};

/**
 * Row in the plugin suppression table.
 *
 * @param {Object} props
 * @param {Object} props.pluginDetails Object containing details about the plugin.
 * @param {string} props.pluginKey A plugin key.
 */
function PluginRow( { pluginKey, pluginDetails } ) {
	const { editedOptions, originalOptions, updateOptions } = useContext( Options );

	const { suppressed_plugins: editedSuppressedPlugins } = editedOptions;
	const { suppressed_plugins: originalSuppressedPlugins } = originalOptions;

	const isOriginallySuppressed = pluginKey in originalSuppressedPlugins;
	const isSuppressed = pluginKey in editedSuppressedPlugins;

	const PluginName = () => (
		<strong>
			{ pluginDetails.Name }
		</strong>
	);

	// Translators: placeholder is an author name.
	const author = sprintf( __( 'By %s. ' ), pluginDetails.Author );

	return (
		<tr>
			<th className="column-status" scope="row">
				<SelectControl
					hideLabelFromVision={ true }
					onChange={ () => {
						const newSuppressedPlugins = { ...editedOptions.suppressed_plugins };

						newSuppressedPlugins[ pluginKey ] = ! isSuppressed;

						updateOptions( { suppressed_plugins: newSuppressedPlugins } );
					} }
					value={ isSuppressed ? true : false }
					label={ __( 'Plugin status:', 'amp' ) }
					options={ [
						{ value: false, label: __( 'Active', 'amp' ) },
						{ value: true, label: __( 'Suppressed', 'amp' ) },
					] }
				/>
			</th>
			<td className="column-plugin">
				<ConditionalDetails
					summary={ pluginDetails.PluginURI ? (
						<a href={ pluginDetails.PluginURI } target="_blank" rel="noreferrer">
							<PluginName />
						</a>
					)
						: <PluginName /> }
				>

					{ [
						pluginDetails.Author && (
							<p className="plugin-author-uri" key="plugin-details-author">
								<small>
									{ pluginDetails.AuthorURI ? (
										<a href={ pluginDetails.AuthorURI } target="_blank" rel="noreferrer">
											{ author }
										</a>
									)
										: author
									}

								</small>
							</p>
						),
						pluginDetails.Description && (
							<div
								key="plugin-details-description"
								className="plugin-description"
								dangerouslySetInnerHTML={ { __html: autop( pluginDetails.Description ) } }
							/>
						),

					].filter( ( child ) => child ) }

				</ConditionalDetails>
			</td>
			<td className="column-details">
				{
					isOriginallySuppressed ? (
						<p>
							<SuppressedPluginTime suppressedPlugin={ originalSuppressedPlugins[ pluginKey ] } />
							<SuppressedPluginUsername suppressedPlugin={ originalSuppressedPlugins[ pluginKey ] } />
							<SuppressedPluginVersion
								pluginDetails={ pluginDetails }
								suppressedPlugin={ originalSuppressedPlugins[ pluginKey ] }
							/>
						</p>
					) : (
						<ValidationErrorDetails errors={ pluginDetails.validation_errors } />
					)
				}
			</td>
		</tr>
	);
}
PluginRow.propTypes = {
	pluginDetails: PropTypes.shape( {
		Author: PropTypes.string,
		AuthorURI: PropTypes.string,
		Description: PropTypes.string,
		Name: PropTypes.string,
		PluginURI: PropTypes.string,
		validation_errors: PropTypes.array,
	} ).isRequired,
	pluginKey: PropTypes.string.isRequired,

};

/**
 * Component rendering the plugin suppression table.
 */
export function PluginSuppression() {
	const { editedOptions, fetchingOptions } = useContext( Options );

	if ( fetchingOptions ) {
		return null;
	}

	const {
		suppressible_plugins: suppressiblePlugins,
	} = editedOptions;

	return (
		<section>
			<h2>
				{ __( 'Plugin Suppression', 'amp' ) }
			</h2>
			<Selectable className="plugin-suppression">
				<p>
					{ __( 'When a plugin adds markup which is invalid on AMP pages, you have two options: you can review the validation error, determine that the invalid markup is not needed, and let the AMP plugin remove it. Alternatively, you can suppress the offending plugin from running on AMP pages. Below is the list of active plugins which have caused validation issues.', 'amp' ) }
				</p>
				<table id="suppressed-plugins-table" className="wp-list-table widefat fixed striped">
					<thead>
						<tr>
							<th className="column-status" scope="col">
								{ __( 'Status', 'amp' ) }
							</th>
							<th className="column-plugin" scope="col">
								{ __( 'Plugin', 'amp' ) }
							</th>
							<th className="column-details" scope="col">
								{ __( 'Details', 'amp' ) }
							</th>
						</tr>
					</thead>
					<tbody>
						{ Object.keys( suppressiblePlugins || {} ).map( ( pluginKey ) => (
							<PluginRow
								key={ `plugin-row-${ pluginKey }` }
								pluginDetails={ suppressiblePlugins[ pluginKey ] }
								pluginKey={ pluginKey }
							/>
						) ) }
					</tbody>
				</table>

			</Selectable>
		</section>
	);
}
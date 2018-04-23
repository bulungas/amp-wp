<?php
/**
 * Class AMP_Img_Sanitizer.
 *
 * @package AMP
 */

/**
 * Class AMP_Img_Sanitizer
 *
 * Converts <img> tags to <amp-img> or <amp-anim>
 */
class AMP_Img_Sanitizer extends AMP_Base_Sanitizer {

	/**
	 * Value used for width attribute when $attributes['width'] is empty.
	 *
	 * @since 0.2
	 *
	 * @const int
	 */
	const FALLBACK_WIDTH = 600;

	/**
	 * Value used for height attribute when $attributes['height'] is empty.
	 *
	 * @since 0.2
	 *
	 * @const int
	 */
	const FALLBACK_HEIGHT = 400;

	/**
	 * Tag.
	 *
	 * @var string HTML <img> tag to identify and replace with AMP version.
	 *
	 * @since 0.2
	 */
	public static $tag = 'img';

	/**
	 * Animation extension.
	 *
	 * @var string
	 */
	private static $anim_extension = '.gif';

	/**
	 * Sanitize the <img> elements from the HTML contained in this instance's DOMDocument.
	 *
	 * @since 0.2
	 */
	public function sanitize() {

		/**
		 * Node list.
		 *
		 * @var DOMNodeList $node
		 */
		$nodes           = $this->dom->getElementsByTagName( self::$tag );
		$need_dimensions = array();

		$num_nodes = $nodes->length;

		if ( 0 === $num_nodes ) {
			return;
		}

		for ( $i = $num_nodes - 1; $i >= 0; $i-- ) {
			$node = $nodes->item( $i );
			if ( ! $node instanceof DOMElement ) {
				continue;
			}

			if ( ! $node->hasAttribute( 'src' ) || '' === trim( $node->getAttribute( 'src' ) ) ) {
				$this->remove_invalid_child( $node );
				continue;
			}

			// Determine which images need their dimensions determined/extracted.
			if ( ! is_numeric( $node->getAttribute( 'width' ) ) || ! is_numeric( $node->getAttribute( 'height' ) ) ) {
				$need_dimensions[ $node->getAttribute( 'src' ) ][] = $node;
			} else {
				$this->adjust_and_replace_node( $node );
			}
		}

		$this->determine_dimensions( $need_dimensions );
		$this->adjust_and_replace_nodes_in_array_map( $need_dimensions );
	}

	/**
	 * "Filter" HTML attributes for <amp-anim> elements.
	 *
	 * @since 0.2
	 *
	 * @param string[] $attributes {
	 *      Attributes.
	 *
	 *      @type string $src Image URL - Pass along if found
	 *      @type string $alt <img> `alt` attribute - Pass along if found
	 *      @type string $class <img> `class` attribute - Pass along if found
	 *      @type string $srcset <img> `srcset` attribute - Pass along if found
	 *      @type string $sizes <img> `sizes` attribute - Pass along if found
	 *      @type string $on <img> `on` attribute - Pass along if found
	 *      @type string $attribution <img> `attribution` attribute - Pass along if found
	 *      @type int $width <img> width attribute - Set to numeric value if px or %
	 *      @type int $height <img> width attribute - Set to numeric value if px or %
	 * }
	 * @return array Returns HTML attributes; removes any not specifically declared above from input.
	 */
	private function filter_attributes( $attributes ) {
		$out = array();

		foreach ( $attributes as $name => $value ) {
			switch ( $name ) {
				case 'src':
				case 'alt':
				case 'class':
				case 'srcset':
				case 'on':
				case 'attribution':
					$out[ $name ] = $value;
					break;

				case 'width':
				case 'height':
					$out[ $name ] = $this->sanitize_dimension( $value, $name );
					break;

				case 'data-amp-layout':
					$out['layout'] = $value;
					break;

				default:
					break;
			}
		}

		return $out;
	}

	/**
	 * Determine width and height attribute values for images without them.
	 *
	 * Attempt to determine actual dimensions, otherwise set reasonable defaults.
	 *
	 * @param DOMElement[][] $need_dimensions Map <img> @src URLs to node for images with missing dimensions.
	 */
	private function determine_dimensions( $need_dimensions ) {

		$dimensions_by_url = AMP_Image_Dimension_Extractor::extract( array_keys( $need_dimensions ) );

		foreach ( $dimensions_by_url as $url => $dimensions ) {
			foreach ( $need_dimensions[ $url ] as $node ) {
				if ( ! $node instanceof DOMElement ) {
					continue;
				}
				if (
					! is_numeric( $node->getAttribute( 'width' ) ) &&
					! is_numeric( $node->getAttribute( 'height' ) )
				) {
					$height = self::FALLBACK_HEIGHT;
					$width  = self::FALLBACK_WIDTH;
					$node->setAttribute( 'width', $width );
					$node->setAttribute( 'height', $height );
					$class = $node->hasAttribute( 'class' ) ? $node->getAttribute( 'class' ) . ' amp-wp-unknown-size' : 'amp-wp-unknown-size';
					$node->setAttribute( 'class', $class );
				} elseif (
					! is_numeric( $node->getAttribute( 'height' ) )
				) {
					$height = self::FALLBACK_HEIGHT;
					$node->setAttribute( 'height', $height );
					$class = $node->hasAttribute( 'class' ) ? $node->getAttribute( 'class' ) . ' amp-wp-unknown-size amp-wp-unknown-height' : 'amp-wp-unknown-size amp-wp-unknown-height';
					$node->setAttribute( 'class', $class );
				} elseif (
					! is_numeric( $node->getAttribute( 'width' ) )
				) {
					$width = self::FALLBACK_WIDTH;
					$node->setAttribute( 'width', $width );
					$class = $node->hasAttribute( 'class' ) ? $node->getAttribute( 'class' ) . ' amp-wp-unknown-size amp-wp-unknown-width' : 'amp-wp-unknown-size amp-wp-unknown-width';
					$node->setAttribute( 'class', $class );
				}
			}
		}
	}

	/**
	 * Now that all images have width and height attributes, make final tweaks and replace original image nodes
	 *
	 * @param DOMNodeList[] $node_lists Img DOM nodes (now with width and height attributes).
	 */
	private function adjust_and_replace_nodes_in_array_map( $node_lists ) {
		foreach ( $node_lists as $node_list ) {
			foreach ( $node_list as $node ) {
				$this->adjust_and_replace_node( $node );
			}
		}
	}

	/**
	 * Make final modifications to DOMNode
	 *
	 * @param DOMNode $node The DOMNode to adjust and replace.
	 */
	private function adjust_and_replace_node( $node ) {

		$layout = $this->get_data_amp_layout( $node );

		$old_attributes = AMP_DOM_Utils::get_node_attributes_as_assoc_array( $node );

		if ( ! empty( $layout ) ) {
			$old_attributes['data-amp-layout'] = $layout;
		}

		$new_attributes = $this->filter_attributes( $old_attributes );
		$new_attributes = $this->set_element_layout_attributes( $node, $new_attributes, $layout );
		$this->add_or_append_attribute( $new_attributes, 'class', 'amp-wp-enforced-sizes' );
		if ( empty( $new_attributes['layout'] ) && ! empty( $new_attributes['height'] ) && ! empty( $new_attributes['width'] ) ) {
			$new_attributes['layout'] = 'intrinsic';
		}

		if ( $this->is_gif_url( $new_attributes['src'] ) ) {
			$this->did_convert_elements = true;

			$new_tag = 'amp-anim';
		} else {
			$new_tag = 'amp-img';
		}
		$new_node = AMP_DOM_Utils::create_node( $this->dom, $new_tag, $new_attributes );
		$node->parentNode->replaceChild( $new_node, $node );
	}

	/**
	 * Determines is a URL is considered a GIF URL
	 *
	 * @since 0.2
	 *
	 * @param string $url URL to inspect for GIF vs. JPEG or PNG.
	 *
	 * @return bool Returns true if $url ends in `.gif`
	 */
	private function is_gif_url( $url ) {
		$ext  = self::$anim_extension;
		$path = wp_parse_url( $url, PHP_URL_PATH );
		return substr( $path, -strlen( $ext ) ) === $ext;
	}
}

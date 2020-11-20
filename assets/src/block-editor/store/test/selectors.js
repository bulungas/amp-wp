/**
 * Internal dependencies
 */
import {
	hasThemeSupport,
	isStandardMode,
	getErrorMessages,
	getAmpPreviewLink,
	getAmpUrl,
} from '../selectors';

describe( 'selectors', () => {
	describe( 'hasThemeSupport', () => {
		it( 'should return whether the theme has AMP support', () => {
			const state = { hasThemeSupport: false };

			expect( hasThemeSupport( state ) ).toBe( false );
		} );
	} );

	describe( 'isStandardMode', () => {
		it( 'should return whether standard mode is enabled', () => {
			const state = { isStandardMode: true };

			expect( isStandardMode( state ) ).toBe( true );
		} );
	} );

	describe( 'getErrorMessages', () => {
		it( 'should return the AMP validation messages', () => {
			const expectedMessages = [ 'Disallowed script', 'Disallowed attribute' ];
			const state = { errorMessages: expectedMessages };

			expect( getErrorMessages( state ) ).toStrictEqual( expectedMessages );
		} );
	} );

	describe( 'getAmpUrl', () => {
		it( 'should return the paired AMP url', () => {
			const url = 'https://example.com/?amp=1';
			const state = { ampUrl: url };

			expect( getAmpUrl( state ) ).toStrictEqual( url );
		} );
	} );

	describe( 'getAmpPreviewLink', () => {
		it( 'should return the AMP preview link', () => {
			const url = 'https://example.com/?preview=true&amp=1';
			const state = { ampPreviewLink: url };

			expect( getAmpPreviewLink( state ) ).toStrictEqual( url );
		} );
	} );
} );

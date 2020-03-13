<?php

namespace AmpProject\Common;

use AmpProject\Fonts;
use AmpProject\Tests\AssertContainsCompatibility;
use PHPUnit\Framework\TestCase;

/**
 * Tests for AmpProject\Fonts.
 *
 * @covers Amp
 * @package ampproject/common
 */
class FontsTest extends TestCase
{
    use AssertContainsCompatibility;

    /**
     * Test the check for an AMP runtime method.
     *
     * @covers Fonts::getEmojiFontFamilyValue()
     */
    public function testGetEmojiFontFamilyValue()
    {
        $value = Fonts::getEmojiFontFamilyValue();
        $this->assertStringContains('Apple Color Emoji', $value);
        $this->assertStringContains(',', $value);
    }
}

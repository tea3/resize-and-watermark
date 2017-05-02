## Overview

This project efficiently help to process photo.

- resize image
- add watermark
- inputs Exif and IPTC titles and descriptions


## Install

Install with git and npm

```
git clone https://github.com/tea3/resize-and-watermark.git
cd resize-and-watermark
npm install
```

### Install ImageMagick and ExifTool

> Resizing images made easy - thanks to [ImageMagick](http://www.imagemagick.org/) and [ExifTool](http://www.sno.phy.queensu.ca/~phil/exiftool/) .

Make sure ImageMagick and ExifTool is installed on your system and properly set up in your `PATH`.

Ubuntu:

```shell
apt-get install imagemagick exiftool
```

Mac OS X (using [Homebrew](http://brew.sh/)):

```shell
brew install imagemagick exiftool
```

Windows & others:

[http://www.imagemagick.org/script/binary-releases.php](http://www.imagemagick.org/script/binary-releases.php)
[http://www.sno.phy.queensu.ca/~phil/exiftool/](http://www.sno.phy.queensu.ca/~phil/exiftool/)

Confirm that ImageMagick is properly set up by executing `convert -help` in a terminal.


## Usage

For example, please create `_config.yml` as follows.

```
resizePix:              # resize task option
  - 0                   # no resize (original size)
  - 1024                # resize images 1024 pixels
  - 2048                # resize images 2048 pixels
# ignoreWatermark:      # If you don't want to add watermark , enable option as following.
#   - 0
#   - 1024
readDir:                              # Folder name including image to resize
  - ./sample JPG/targetFolder
distDir: ./sample JPG/resizedFolder   # Path where you want to output the resized image
watermark: ./sample JPG/watermark.png # File path of watermark image
watermarkWidthRate : 0.1              # The size of the image occupied by the watermark
watermarkMarginRate: 0.02             # Watermark margin
quality: 97                           # JPEG quality value

fileTitle: My Picture                 # Always a character string to be included in the IPTC title meta field
constTag:                             # Always a character string to be included in the IPTC keywords meta field
  - photo
  - animal
  - etc
copyright: (c) your-name            # Always a character string to be included in the Exif copyright field
descriptionTemplate : desciption    # Always a character string to be included in the Exif desciption field
```

Then run node.js.

```
$ node index.js
```

or 

```
$ node index.js image1.jpg image2.jpg ...
```

## Control with keywords and Exif

You can customize processing with with photo included keywords and exif. For example , how to include keywords, please see the following.

- [How to use keywords in Lightroom](https://helpx.adobe.com/lightroom/help/keywords.html)

### watermark position

You can customize the position of the watermark based on `pos:****-****` keywords .

| keywords to include in photos | watermark position |
| :---: | :---: |
| `pos:top-left` | NorthWest |
| `pos:top-right` | NorthEast |
| `pos:bottom-left` | SouthWest |
| `pos:bottom-right` | SouthEast |
| `pos:middle-center` | Center |

Also , you can customize position rule . if you want to customize , please edit `settings/watermarkPosition.json`.

### Manual input of lens information ( Exif and IPTC title )

When resizing, lens information can be entered automatically by keyword.

| keywords to include in photos | Input lens information ( Exif and IPTC ) |
| :---: | :---: |
| `lens:50mmf1.2s` | Ai Nikkor 50mm f/1.2S |
| `lens:laowa105mm` | LAOWA 105mm F2 Bokeh Dreamer STF |

 Also , you can customize lens rule . if you want to customize , please edit `settings/cameraLens.json`.


## Using Export Actions in Adobe Lightroom

For example, if you want to use Lightroom's Export Action, please describe Apple Script in Automator as follows.

```
function run(input, parameters) {

	var sys = Application("System Events");
	var cdm = "cd \"$HOME/Desktop/you-cloned-dir/resize-and-watermark\"";
	var nvm = "nvm use 4.3.0";

	var Terminal = Application('Terminal')
	Terminal.activate()
	var terW1 = Terminal.windows[0]

	delay(2)
	Terminal.doScript( cdm , {in: terW1} )
	delay(5)
	Terminal.doScript( nvm , {in: terW1} )
	delay(5)
	Terminal.doScript( "node index.js" , {in: terW1} )

  	return input;
}
```

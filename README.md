# cosmic-cli

A Command Line Tool for Managing Your Cosmic JS Buckets

## Installing

Install the CLI globally:

`npm i -g cosmic-cli`

To check that it installed properly, run `cosmic` on your command line and you should see a list of commands.

## Getting Started

All commands are of the form: `cosmic [command] [command-options]`. Let's walk through the commands you need to
get started.


### Login

Use your credentials from (cosmicjs.com) to login on the command line. You will only have to do this once.

```bash
$ cosmic login
  ? Email: starman@gmail.com
  ? Password: [hidden]
Authenticated
```

### Use bucket

Now that you are logged in, you can connect to buckets. To connect to the bucket with slug 'wedding-site':

```bash
$ cosmic use-bucket -s wedding-site --read_key my_read_key --write_key my_write_key
Now using bucket wedding-site
```

To test that we connected to the bucket properly:

```
$ cosmic get-objects --limit 1
Success
{ objects:
   [ { _id: '55b3da7740d7a3791b000002',
       bucket: '55b3d557df0fb1df7600004b',
       slug: 'main-menu',
       title: 'Main Menu',
       content: '<p><br></p>',
       metafields: [Array],
       type_slug: 'sections',
       created: '2015-07-25T18:50:31.809Z',
       metadata: [Object] },
    ],
  limit: 1 }
```

Now you are ready to use any of the commands to have full control over your buckets!

## Usage

All cosmic CLI commands are of the format:

`Usage: cosmic [command] [options]`

### Help

Run `cosmic -h` for a list of all commands. The list is also included at the bottom of this README.

Run `cosmic [command] -h` for details on options for a specific command.

### Examples

Below are a few examples of commands. Only a handful of the possible options are shown for the commands.

**Creating an Object Type and then an Instance**

Creating a planet object type, and specifying default metafields all instances should have.

`$ cosmic add-object-type --slug planet-type --title 'Planet Objects' --metafields '[{"type":"text", "key": "shape", "value": "Sphere"}]'`

Making an edit to the object type

`$ cosmic edit-object-type -s planet-type --title 'PlANeT oBject'`

Creating an instance

`$ cosmic add-object add-object --type_slug planet-type --title 'Clypso 6Y'`

**Uploading Image Files to a Bucket**

We upload myLocalImage.png from our computer to Cosmic with the name provided to -t, and into the specified folder.

Using shorthand params -f for --file and -t for --title

`$ cosmic add-media -f ../myLocalImage.png -t myNameForFileOnCosmic.png --folder product-images`

You can also give a name without an extension, and it will parse the extension for you.

`$ cosmic add-media -f ../myLocalImage.png -t myNameForFileOnCosmic`

### JSON String Inputs

Some commands allow for two types of input: argument based and json string based. This is best illustrated with an example:

To add a new barebones object with only a title that is of object type `planet-type`, there are two ways we could go about it, with equivalent results:

```
$ cosmic add-object --type_slug 'planet-type' --title 'Clypso 6Y'
```

or

```
$ cosmic add-object --json '{"type_slug": "planet-type", "title": "Clypso 6Y"}'
```

The json string option is convenient in some use cases, and is included on the following commands:

*   add-object
*   add-object-type
*   edit-object
*   edit-object-type


### Commands

For a list of the options for a command, use `cosmic [command] -h`

*   begin
*   login
*   use-bucket \[options\]
*   add-bucket \[options\]
*   get-objects \[options\]
*   get-object \[options\]
*   get-object-types \[options\]
*   add-object-type \[options\]
*   edit-object-type \[options\]
*   delete-object-type \[options\]
*   add-object \[options\]
*   edit-object \[options\]
*   delete-object \[options\]
*   add-media \[options\]
*   get-media \[options\]
*   delete-media \[options\]
*   add-webhook \[options\]
*   delete-webhook \[options\]

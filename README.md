# Cosmic CLI

The official command line tool for [Cosmic JS](https://cosmicjs.com).  It includes all of the awesome features of the [Cosmic JS NPM module](https://github.com/cosmicjs/cosmicjs-node).  Use it to log in to your Cosmic JS account, manage your Buckets and manage data, files and users withing your Buckets.

## 🛠️ Installation

Install the CLI globally:

```
npm i -g cosmic-cli
```

To check that it installed properly, run `cosmic` on your command line and you should see a list of commands.

## 🏁 Getting Started

All commands are of the form: `cosmic [command] [command-options]`. Let's walk through the commands you need to
get started.  For an introduction to the power of the Cosmic CLI run the `begin` command.
```
cosmic begin
```


### 🔐 Login

Use your credentials from (cosmicjs.com) to login on the command line. You will only have to do this once.

```bash
$ cosmic login
  ? Email: starman@gmail.com
  ? Password: [hidden]
Authenticated
```

## 🚀 Usage

All cosmic CLI commands are of the format:

`Usage: cosmic [command] [options]`


### Use Bucket

Now that you are logged in, you can connect to buckets. To connect to the bucket with slug 'wedding-site':

```bash
$ cosmic use-bucket -s simple-react-blog --read_key my_read_key --write_key my_write_key
Now using bucket simple-react-blog
```

To test that we connected to the bucket properly:

```
$ cosmic get-objects --limit 1
Success
{ objects: 
   [ { _id: '59df6dd5fd8d731b2100118d',
       bucket: '59df6dcbfd8d731b21001188',
       slug: 'jane-doe',
       title: 'Jane Doe',
       content: '<p>Something about Jane...</p>',
       metafields: [Array],
       type_slug: 'authors',
       created: '2017-10-12T13:27:49.663Z',
       created_at: '2017-10-12T13:27:49.663Z',
       status: 'published',
       metadata: [Object] } ],
  limit: 1 }
```

Now you are ready to use any of the commands to have full control over your buckets!

### 🗺 Help

Run `cosmic -h` for a list of all commands. The list is also included at the bottom of this README.

Run `cosmic [command] -h` for details on options for a specific command.

### Examples

Below are a few examples of commands. Only a handful of the possible options are shown for the commands.

**Creating an Object Type and then an Instance**

Creating a "Planets" Object Type, and specifying default Metafields all Objects in this Object Type should have.  For this example all planets will now include the Radius Metafield.  See the [REST API docs](https://cosmicjs.github.io/rest-api-docs/?javascript#metafields) for all Metafield options.
```
$ cosmic add-object-type --slug planets --title Planets --metafields '[{"title": "Radius","type":"text", "key": "radius"}]'
```

Making an edit to the Object Type.  This example adds another Metafield to the Planets Object Type.
```
$ cosmic edit-object-type -s planets --metafields Planets --metafields '[{"title": "Radius","type":"text", "key": "radius"}{"title": "Distance from Sun","type":"text", "key": "distance_from_sun"}]'
```

Creating an Object:
```
$ cosmic add-object add-object --type_slug planets --title Venus --metafields '[{"title": "Radius","type":"text", "key": "radius", "value": "3,760 miles"}{"title": "Distance from Sun","type":"text", "key": "distance_from_sun", "value": "67.24 million miles"}]'
```

🏞 **Uploading Files to a Bucket**

We upload any file from our computer to Cosmic with the name provided to -t, and into a specified folder (optional).

Using shorthand params -f for --file and -t for --title
```
$ cosmic add-media -f ../my-cat.png -t my-cat.png --folder cat-images
```

### JSON String Inputs

Some commands allow for two types of input: argument based and json string based. This is best illustrated with an example:

To add a new barebones object with only a title that is of object type `planet-type`, there are two ways we could go about it, with equivalent results:

```
$ cosmic add-object --type_slug planets --title Venus
```

or

```
$ cosmic add-object --json '{"type_slug": "planets", "title": "Venus"}'
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

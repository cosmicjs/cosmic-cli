<p align="center">
  <a href="https://www.cosmicjs.com"><img src="https://cdn.cosmicjs.com/3cf62ab0-8e13-11ea-9b8f-cd0254a8c979-cosmic-dark.svg" alt="Cosmic" width="400"></a>
</p>
<p align="center">
  📖 <a href="https://docs.cosmicjs.com">View Docs</a>
</p>
<p align="center">
	<a href="https://www.npmjs.com/package/cosmic-cli"><img src="https://badge.fury.io/js/cosmic-cli.svg" alt="npm version"></a>
</p>

This is the official command line tool for [Cosmic](https://www.cosmicjs.com).  Use it to log in to your Cosmic account, manage Buckets, data, files and users within your Buckets, all from the comfort of your command line interface.

## 🛠️ Installation

Install the CLI globally:

```bash
npm i -g cosmic-cli
```

To check that it installed properly, run `cosmic` on your command line and you should see a list of commands.

## 🏁 Getting Started

Let's walk through the commands you need to get started.  For an introduction to the Cosmic CLI run the `begin` command.
```bash
cosmic begin
```


### 🔐 Login

Use your credentials (from https://www.cosmicjs.com) to login on the command line. You will only have to do this once. If you used GitHub to sign up, you can also login via authentication token which you can find at https://www.cosmicjs.com/account/authentication

```bash
$ cosmic login
  ? Email: starman@gmail.com
  ? Password: [hidden]
Authenticated
```

## 🚀 Usage

All Cosmic CLI commands are of the format:

```bash
cosmic [command] [options]
```


### Use Bucket

Now that you are logged in, you can connect to any of your Buckets on your account. To connect to the Bucket with slug 'simple-react-blog':

```bash
$ cosmic use-bucket simple-react-blog
Now using bucket simple-react-blog
```

To test that we connected to the Bucket properly:

```bash
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

Now you are ready to use any of the commands to have full control over your Bucket!


### 🗺 Help

Run `cosmic -h` for a list of all commands. The list is also included at the [bottom of this README](https://github.com/cosmicjs/cosmic-cli#commands).

Run `cosmic [command] -h` for details on options for a specific command.

### Examples

Below are a few examples of commands. Only a handful of the possible options are shown for the commands.

**Creating an Object Type and then an Object**

Creating a "Planets" Object Type and specifying default Metafields all Objects in this Object Type should have.  For this example all planets will now include the Metafield titled "Radius".  See the [REST API docs](https://docs.cosmicjs.com/rest-api/metafields.html) for all Metafield options.
```bash
$ cosmic add-object-type --slug planets --title Planets --metafields '[{"title": "Radius","type":"text", "key": "radius"}]'
```

Making an edit to the Object Type.  This example adds another Metafield to the "Planets" Object Type.
```bash
$ cosmic edit-object-type -s planets --metafields '[{"title": "Radius","type":"text", "key": "radius"},{"title": "Distance from Sun","type":"text", "key": "distance_from_sun"}]'
```

Creating an Object in the "Planets" Object Type:
```bash
$ cosmic add-object --type_slug planets --title Venus --metafields '[{"title": "Radius","type":"text", "key": "radius", "value": "3,760 miles"},{"title": "Distance from Sun","type":"text", "key": "distance_from_sun", "value": "67.24 million miles"}]'
```

🏞 **Uploading Files to a Bucket**

We upload any file from our computer to Cosmic with the name provided to -t, and into a specified folder (optional).

Using shorthand params -f for --file and -t for --title
```bash
$ cosmic add-media -f ./my-cat.png -t my-cat.png --folder cat-images
```

### JSON String Inputs

Some commands allow for two types of input: argument based and json string based. This is best illustrated with an example:

To add a new barebones Object with only a title that is of Object Type `planets`, there are two ways we could go about it, with equivalent results:

```bash
$ cosmic add-object --type_slug planets --title Venus
```

or

```bash
$ cosmic add-object --json '{"type_slug": "planets", "title": "Venus"}'
```

The json string option is convenient in some use cases, and is included on the following commands:

*   add-object
*   add-object-type
*   edit-object
*   edit-object-type


### Commands

For a list of the options for a command, use `cosmic [command] -h`

*   begin                          `Guide to Getting Started`
*   login                        
*   init                           `init starter app`
*   which-user                     `outputs the email of the current user`
*   which-bucket                   `outputs the slug of the current Bucket`
*   get-buckets [options]          `shows Buckets available to user`
*   get-bucket [options]           `get current bucket object`
*   use-bucket [options] [slug]  
*   add-bucket [options]         
*   delete-bucket [options]      
*   get-objects [options]        
*   get-object [options]         
*   get-object-types             
*   add-object-type [options]    
*   edit-object-type [options]   
*   delete-object-type [options]
*   add-object [options]         
*   edit-object [options]        
*   delete-object [options]      
*   add-media [options]          
*   get-media [options]          
*   delete-media [options]       
*   add-webhook [options]        
*   delete-webhook [options]     
*   add-user [options]           

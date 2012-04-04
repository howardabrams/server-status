Once Upon a Time
----------------

I've got a network problem with some of the servers in my lab.
Yeah, sad.

We're busy flipping cables and replacing routers, and I need a
way to see if things are improving. I want to see *history* 
of request times.

So I put together a little [Node][1] app to download a file from
each site, and store the results in a [Redis][3] database.


Installing
----------

Make sure you have the following engines installed locally:

  * [Node][1]
  * [NPM][2] ... Node.js package manager

Next, download the code and run the following to download the
dependencies:

    npm install


Running
-------

Start up the server, via:

    node app.js

Finally, open up a browser and view the results:

    http://localhost:3000/


Component Details
-----------------

The server part is pretty straight-forward node code that kicks off a timer
that repeats every few seconds (details are stored in the `config.js` file).

In the `public` directory, the `index.html` builds up a panel for each site
using [Fuzzytoast][6]. A history of the results is displayed using the area
chart from [Google Charts][4].


  [1]: http://nodejs.org/
  [2]: http://npmjs.org/
  [3]: http://redis.org/
  [4]: https://google-developers.appspot.com/chart/interactive/docs/gallery/areachart
  [5]: http://jquery.com
  [6]: http://www.fuzzytoast.com


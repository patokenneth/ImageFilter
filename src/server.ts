import express from 'express';
import {Request, Response, NextFunction} from 'express';
import axios from 'axios';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';
import { url } from 'inspector';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */
   app.get("/filteredImage", async(req: Request, res: Response, next : NextFunction) => {

    const {image_url} = req.query;
    
    if(!image_url)
    return res.status(400).send({message : "no download url detected"});

    try{
      const media : string = await filterImageFromURL(image_url.toString());
    return res.status(200).sendFile(media, async () =>{
      await deleteLocalFiles([media]);

    });
    }catch(e){
      return res.status(422).send({message: "invalid image url"});
    }
   
   })
  //! END @TODO1

  //simple test for image presence
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req : Request, res : Response ) => {
    return res.status(200).send("try GET /filteredimage?image_url={{}}");
        
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();
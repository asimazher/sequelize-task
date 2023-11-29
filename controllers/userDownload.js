const express = require('express');
const Queue = require('bull');
const downloadQueue = new Queue('downloadQueue')
const path = require('path');
const fs = require('fs').promises;
const app = express();


// Process download jobs
downloadQueue.process(async (job) => {
    const { filename } = job.data;
    const filePath = path.join(uploadFolder, filename);
  
    return new Promise(async(resolve, reject) => {
      // Send the file for download
        // Resolve the Promise with the file path
                console.log('job processed');

        resolve(filePath);

        // Wait for a brief moment to ensure the file is downloaded before deletion
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Delete the file from the uploads folder
      await fs.unlink(filePath);
      console.log('file deleted.');


      });
    });


// const dirname = "C:\Users\asim\Desktop\crud with mySQL"

// Define your upload folder
const uploadFolder = path.join('uploads');

// Example route to download a file
const download = async (req, res) => {

  const filename = req.params.filename;

     // Enqueue a download job
     const job = await downloadQueue.add({ filename });
     console.log('job added.');

    //  res.status(200).send('Download job enqueued.');

// Wait for the job to complete
job.finished().then(async (result) => {
    // Send the file for download
    console.log('job finished.');
    res.download(result);
  }).catch((err) => {
    // Handle error, for example, send an HTTP response
    res.status(500).send(`Error downloading file: ${err.message}`);
  });
};


//   const filePath = path.join(uploadFolder, filename);

  // Send the file for download
//   res.download(filePath, (err) => {
//     if (err) {
//         console.error('Error:', err.message);
//       // Handle error, for example, send an HTTP response
//       res.status(500).send('Error downloading file');
//     }
//   });
// };


  

module.exports = download

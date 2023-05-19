const multer =require('multer')
const path=require('path')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      if (file.fieldname !== 'image') {
        cb(null, 'public/admin/multer/img')
      } else {
        cb(null, '/admin/uploadedimages')
      }
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
  
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
    }
  
  })
  
 const upload = multer({ storage : storage,
    fileFilter: function (params,file,callback) {
      if (file.mimetype == "image/png" || file.mimetype == "image/jpeg" || file.mimetype == "image/jpg") {
        callback(null, true)
      } else {
        console.log('only jpg & png file supported !');
        callback(null, false)
      }
  }
  })
module.exports = {
  upload
}
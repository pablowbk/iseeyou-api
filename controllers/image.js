const Clarifai = require('clarifai');

const app = new Clarifai.App({
  apiKey: '75e30b4dfc1747aba24771de6c945ccf'
});

const handleApiCall = (req, res) => {
  app.models
    .predict(
      Clarifai.FACE_DETECT_MODEL,
      req.body.input
    )
    .then(data => res.json(data))
    .catch(err => res.status(400).json('Unable to detect with current input data'))
  }

const handleImagePut = (req, res, db) => {
  const { id } = req.body;
  db('users')
    .where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
      res.json(entries[0]);
    })
    .catch(err => res.status(400).json('unable to get entries'))
}

module.exports = {
  handleImagePut: handleImagePut,
  handleApiCall: handleApiCall
}
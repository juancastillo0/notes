const express = require("express");
const router = express.Router();
const utils = require("../utils");
const ObjectId = require("mongodb").ObjectId;

//Sergio Naranjo: Sería bueno agregar más funcinalidades al canvas
// Tal vez algo como agregar un texto, imagen o algo parecido.

router.post("/canvas", utils.ensureAuthenticated, (req, res) => {
  const canvas = req.body;
  canvas.user = req.user._id;
  req.db.collection("canvas").insertOne(canvas, (error, result) => {
    if (error) return res.status(500).json({ error });

    if (result.insertedCount == 1) {
      return res.status(201).json({ _id: result.insertedId });
    } else {
      return res
        .status(500)
        .json({ error: "Error en el servidor intente más tarde." });
    }
  });
});

router.get("/canvas", utils.ensureAuthenticated, (req, res) => {
  req.db
    .collection("canvas")
    .find({ user: req.user._id })
    .toArray((error, documents) => {
      if (error) return res.status(500).json({ error });

      if (!req.query.fields) {
        return res.json(documents);
      } else {
        return res.json(
          documents.map(d => {
            const documentFieds = {};
            req.query.fields.forEach(field => {
              documentFieds[field] = d[field];
            });
            return documentFieds;
          })
        );
      }
    });
});

router.get("/canvas/:id", utils.ensureAuthenticated, (req, res) => {
  const canvasId = ObjectId(req.params.id);
  req.db
    .collection("canvas")
    .findOne({ user: req.user._id, _id: canvasId }, (error, document) => {
      if (error) return res.status(500).json({ error });

      if (!req.query.fields) {
        return res.json(document);
      } else {
        const documentFieds = {};
        req.query.fields.forEach(field => {
          documentFieds[field] = document[field];
        });
        return res.json(documentFieds);
      }
    });
});

router.put("/canvas/:id", utils.ensureAuthenticated, (req, res) => {
  const canvasId = ObjectId(req.params.id);
  req.db
    .collection("canvas")
    .updateOne(
      { user: req.user._id, _id: canvasId },
      { $set: { paths: req.body.paths } },
      (error, result) => {
        if (error) return res.status(500).json({ error });

        if (result.matchedCount === 1) {
          return res.status(200).json({ message: "Actualización exitosa." });
        } else {
          return res.status(404).json({ error: "No se encontró el recurso." });
        }
      }
    );
});

router.delete("/canvas/:id", utils.ensureAuthenticated, (req, res) => {
  const canvasId = ObjectId(req.params.id);
  req.db
    .collection("canvas")
    .deleteOne({ user: req.user._id, _id: canvasId }, (error, result) => {
      if (error) return res.status(500).json({ error });

      if (result.deletedCount === 1) {
        return res.status(200).json({ message: "Eliminación exitosa." });
      } else {
        return res.status(404).json({ error: "No se encontró el recurso." });
      }
    });
});

module.exports = router;

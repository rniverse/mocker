const { Router } = require('root/utils');
const { NoteCtrl } = require('./controllers');

const router = Router();

router.get('/:id', (req, res) => NoteCtrl.getNote(req, res));
router.post('/', (req, res) => NoteCtrl.addNote(req, res));
router.put('/:id', (req, res) => NoteCtrl.updateNote(req, res));
router.delete('/:id', (req, res) => NoteCtrl.deleteNote(req, res));
router.get('/', (req, res) => NoteCtrl.getNotes(req, res));
router.use('/**', (_req, _res, next) => next());

module.exports = router;

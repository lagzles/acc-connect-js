const express = require('express');
const { authRefreshMiddleware, getHubs, getProjects, getProjectContents, getItemVersions } = require('../services/aps.js');
const { getItem, getModelSets } = require('../services/aps.js');

let router = express.Router();

router.use('/api/hubs', authRefreshMiddleware);

router.get('/api/hubs', async function (req, res, next) {
    try {
        const hubs = await getHubs(req.internalOAuthToken.access_token);
        res.json(hubs.map(hub => ({ id: hub.id, name: hub.attributes.name })));
    } catch (err) {
        next(err);
    }
});

router.get('/api/hubs/:hub_id/projects', async function (req, res, next) {
    try {
        const projects = await getProjects(req.params.hub_id, req.internalOAuthToken.access_token);
        res.json(projects.map(project => ({ id: project.id, name: project.attributes.name })));
    } catch (err) {
        next(err);
    }
});

router.get('/api/hubs/:hub_id/projects/:project_id/contents', async function (req, res, next) {
    try {
        const entries = await getProjectContents(req.params.hub_id, req.params.project_id, req.query.folder_id, req.internalOAuthToken.access_token);
        res.json(entries.map(entry => ({ id: entry.id, name: entry.attributes.displayName, folder: entry.type === 'folders' })));
    } catch (err) {
        next(err);
    }
});

router.get('/api/hubs/:hub_id/projects/:project_id/contents/:item_id/versions', async function (req, res, next) {
    try {
        const versions = await getItemVersions(req.params.project_id, req.params.item_id, req.internalOAuthToken.access_token);
        // console.log('Getting manifest for item:', req.params.item_id);
        res.json(versions.map(version => ({ id: version.id, name: version.attributes.createTime })));
    } catch (err) {
        next(err);
    }
});


router.get('/api/hubs/:hub_id/projects/:project_id/contents/:item_id/stuff', async function (req, res, next) {
    try {
        const item = await getItem(req.params.project_id, req.params.item_id, req.internalOAuthToken.access_token);
        res.json(item);
    } catch (err) {
        next(err);
    }
});


router.get('/api/manifest/:project_id/:item_id', async function (req, res, next) {
    try {
        const item = await getItem(req.params.project_id, req.params.item_id, req.internalOAuthToken.access_token);
        res.json({item});
    } catch (err) {
        console.log('Error getting manifest:', err);
        next(err);
    }
});

router.get('/api/hubs/:containerId/modelsets', async function (req, res, next) {
    try {   

        const aaa = await getModelSets(req.params.containerId, req.internalOAuthToken.access_token);
        console.log('Model sets:', aaa);

    }
    catch (err) {
        console.log('Error getting hubs:', err.message);
        next(err.message);
    }   
});


module.exports = router;
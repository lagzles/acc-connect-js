async function getJSON(url) {
    const resp = await fetch(url);
    if (!resp.ok) {
        alert('Could not load tree data. See console for more details.');
        console.error(await resp.text());
        return [];
    }
    return resp.json();
}

function createTreeNode(id, text, icon, children = false) {
    return { id, text, children, itree: { icon } };
}

async function getHubs() {
    const hubs = await getJSON('/api/hubs');
    return hubs.map(hub => createTreeNode(`hub|${hub.id}`, hub.name, 'icon-hub', true));
}

async function getProjects(hubId) {
    const projects = await getJSON(`/api/hubs/${hubId}/projects`);
    return projects.map(project => createTreeNode(`project|${hubId}|${project.id}`, project.name, 'icon-project', true));
}

async function getContents(hubId, projectId, folderId = null) {
    const contents = await getJSON(`/api/hubs/${hubId}/projects/${projectId}/contents` + (folderId ? `?folder_id=${folderId}` : ''));
    return contents.map(item => {
        if (item.folder) {
            return createTreeNode(`folder|${hubId}|${projectId}|${item.id}`, item.name, 'icon-my-folder', true);
        } else {
            // return createTreeNode(`item|${hubId}|${projectId}|${item.id}`, item.name, 'icon-item', true);
            return createTreeNode(`item|${hubId}|${projectId}|${item.id}`, item.name, 'icon-my-folder', true);
        }
    });
}

async function getVersions(hubId, projectId, itemId) {
    console.log(hubId, projectId, itemId);

    const versions = await getJSON(`/api/hubs/${hubId}/projects/${projectId}/contents/${itemId}/versions`);
    // console.log('versions', versions);
    const last_version = versions[0]
    console.log('last_version.id', last_version.id)

    const stuff = await getJSON(`/api/hubs/${hubId}/projects/${projectId}/contents/${itemId}/stuff`);
    console.log('stuff 2', stuff);

    const modelSetsProj = await getJSON(`/api/hubs/${projectId}/modelsets`);
    console.log('modelSetsProj', modelSetsProj);

    // const manifest = await getJSON(`/api/manifest/${projectId}/${itemId}`);
    // console.log('manifestttttttt', manifest);

    // onSelectionChanged(last_version.id);

    return versions.map(version => createTreeNode(`version|${version.id}`, version.name, 'icon-version'));
}

export function initTree(selector, onSelectionChanged) {
    onSelectionChanged("");

    // See http://inspire-tree.com
    const tree = new InspireTree({
        data: function (node) {
            if (!node || !node.id) {
                return getHubs();
            } else {
                const tokens = node.id.split('|');
                switch (tokens[0]) {
                    case 'hub': return getProjects(tokens[1]);
                    case 'project': return getContents(tokens[1], tokens[2]);
                    case 'folder': return getContents(tokens[1], tokens[2], tokens[3]);
                    case 'item': return getVersions(tokens[1], tokens[2], tokens[3]);
                    default: return [];
                }
            }
        }
    });
    tree.on('node.click', async function (event, node) {

        // Remove a classe 'selected' de todos os nós antes de adicionar ao clicado
        document.querySelectorAll('.inspire-tree li').forEach(item => {
            item.classList.remove('selected');
        });

        // Adiciona a classe apenas ao nó clicado
        const clickedElement = document.querySelector(`[data-uid="${node.id}"]`);
        if (clickedElement) {
            clickedElement.classList.add('selected');

            const tokens = node.id.split('|');

            if (tokens[0] === 'version') {
                const versionId = tokens[1];
                onselectionChanged(versionId);
            }
        }

        event.preventTreeDefault();
        
    });
    return new InspireTreeDOM(tree, { target: selector });
}

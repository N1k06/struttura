
/**
 * Loads and parses HTML templates from a separate file.
 * @param {string} url - The path to the template file.
 * @returns {Promise<{[id: string]: DocumentFragment} | null>} A map of template IDs to their content.
 */
const loadTemplates = async (url) => {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to load templates: ${response.status}`);
        }
        const text = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');
        const templates = {};
        doc.querySelectorAll('template').forEach(template => {
            templates[template.id] = template.content;
        });
        return templates;
    } catch (error) {
        console.error("Error loading templates:", error);
        return null;
    }
};

/**
 * Main application logic, executed after the DOM is fully loaded.
 */
document.addEventListener('DOMContentLoaded', async () => {
    // --- DOM Element Selectors ---
    const loadUsersLink = document.getElementById('load-users-link');
    const loadProductsLink = document.getElementById('load-products-link');
    const dataTable = document.getElementById('data-table');
    const loadingIndicator = document.getElementById('loading-indicator');
    const tableThead = dataTable.querySelector('thead');
    const tableTbody = dataTable.querySelector('tbody');

    // --- Load External HTML Templates ---
    const templates = await loadTemplates('/templates/dashboard_components.html');
    if (!templates) {
        tableTbody.innerHTML = `<tr><td colspan="100%" class="px-6 py-4 text-center text-red-500">FATAL: Could not load UI templates.</td></tr>`;
        return;
    }

    // --- Data Fetching Logic ---
    const fetchData = async (url) => {
        loadingIndicator.style.display = 'flex';
        dataTable.style.display = 'none';
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status} on ${url}`);
            }
            return await response.json();
        } catch (error) {
            console.error("Could not fetch data:", error);
            const errorRow = templates.noDataRow.cloneNode(true);
            errorRow.querySelector('td').textContent = 'Failed to load data. Check console for details.';
            errorRow.querySelector('td').classList.add('text-red-500');
            tableTbody.innerHTML = '';
            tableTbody.appendChild(errorRow);
            return null;
        } finally {
            loadingIndicator.style.display = 'none';
            dataTable.style.display = 'table';
        }
    };

    // --- Table Rendering Logic ---
    const renderTable = (data, title) => {
        tableThead.innerHTML = '';
        tableTbody.innerHTML = '';

        if (!data || data.length === 0) {
            const headerTemplate = templates.tableHeader.cloneNode(true);
            headerTemplate.querySelector('th').textContent = title;
            tableThead.appendChild(headerTemplate);

            const noDataTemplate = templates.noDataRow.cloneNode(true);
            noDataTemplate.querySelector('td').textContent = 'No data available for this category.';
            tableTbody.appendChild(noDataTemplate);
            return;
        }

        const headers = Object.keys(data[0]);
        const headerRowFragment = document.createDocumentFragment();
        headers.forEach(headerText => {
            const th = templates.tableHeaderCell.cloneNode(true);
            th.querySelector('th').textContent = headerText;
            headerRowFragment.appendChild(th);
        });
        tableThead.appendChild(headerRowFragment);

        const bodyFragment = document.createDocumentFragment();
        data.forEach(item => {
            const rowNode = templates.tableBodyRow.cloneNode(true);
            const rowElement = rowNode.querySelector('tr');
            headers.forEach(header => {
                const td = templates.tableBodyCell.cloneNode(true);
                td.querySelector('td').textContent = item[header];
                rowElement.appendChild(td);
            });
            bodyFragment.appendChild(rowNode);
        });
        tableTbody.appendChild(bodyFragment);
    };

    // --- Initial State ---
    const welcomeMessage = () => {
        const headerTemplate = templates.tableHeader.cloneNode(true);
        headerTemplate.querySelector('th').textContent = 'Welcome';
        tableThead.appendChild(headerTemplate);

        const noDataTemplate = templates.noDataRow.cloneNode(true);
        noDataTemplate.querySelector('td').textContent = 'Please select a category from the sidebar to load data.';
        tableTbody.appendChild(noDataTemplate);
    };

    // --- Event Listeners ---
    loadUsersLink.addEventListener('click', async (event) => {
        event.preventDefault();
        const data = await fetchData('/api/users');
        if (data) renderTable(data, 'Users');
    });

    loadProductsLink.addEventListener('click', async (event) => {
        event.preventDefault();
        const data = await fetchData('/api/products');
        if (data) renderTable(data, 'Products');
    });

    // --- Initial Render ---
    welcomeMessage();
});

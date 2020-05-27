const table = document.querySelector('#table');
$('#table').DataTable({
  "language": {
    "url": "//cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json"
  }
});

const editCategoryModal = document.querySelector('#editCategoryModal');
const actionEdit = document.querySelectorAll('.action-edit');
const editForm = document.querySelector('#editForm');


const name = document.querySelector('input[name=name]');
const deleted_at = document.querySelector('select[name=deleted_at]');

actionEdit.forEach(edit => {
  edit.addEventListener('click', async function () {
    const id = this.getAttribute('data-id');
    const {data: {category}} = await axios.get(`/admin/categories/${id}`);

    editForm.action = `/admin/categories/${id}`;
    editForm.method = 'POST';
    name.value = category.name ? category.name : '';

    deleted_at.value = category.deleted_at ? 1 : 0;
    $(editCategoryModal).modal('show');
  });
});
const table = document.querySelector('#table');
$('#table').DataTable({
  "language": {
    "url": "//cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json"
  }
});

const editSettingModal = document.querySelector('#editSettingModal');
const actionEdit = document.querySelectorAll('.action-edit');
const editForm = document.querySelector('#editForm');


const key = document.querySelector('input[name=key]');
const value = document.querySelector('input[name=value]');

actionEdit.forEach(edit => {
  edit.addEventListener('click', async function () {
    const id = this.getAttribute('data-id');
    const {data: {setting}} = await axios.get(`/admin/settings/${id}`);

    editForm.action = `/admin/settings/${id}`;
    editForm.method = 'POST';
    key.value = setting.key ? setting.key : '';
    value.value = setting.value ? setting.value : '';

    $(editSettingModal).modal('show');
  });
});
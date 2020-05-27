const table = document.querySelector('#table');
$('#table').DataTable({
  "language": {
    "url": "//cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json"
  }
});

const editLevelModal = document.querySelector('#editModal');
const actionEdit = document.querySelectorAll('.action-edit');
const editForm = document.querySelector('#editForm');


const levelInput = document.querySelector('input[name=level]');
const minpoints = document.querySelector('input[name=minpoints]');
const maxpoints = document.querySelector('input[name=maxpoints]');

actionEdit.forEach(edit => {
  edit.addEventListener('click', async function () {
    const id = this.getAttribute('data-id');
    const {data: {level}} = await axios.get(`/admin/levels/${id}`);
    editForm.action = `/admin/levels/${id}`;
    editForm.method = 'POST';
    levelInput.value = level.level ? level.level : '';
    minpoints.value = level.minpoints ? level.minpoints : 0;
    maxpoints.value = level.maxpoints ? level.maxpoints : 0;

    $(editLevelModal).modal('show');
  });
});
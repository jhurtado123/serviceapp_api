const table = document.querySelector('#table');
$('#table').DataTable({
  "language": {
    "url": "//cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json"
  }
} );

const editUserModal = document.querySelector('#editUserModal');
const actionEdit = document.querySelectorAll('.action-edit');
const editForm = document.querySelector('#editForm');

const name = document.querySelector('input[name=name]');
const description = document.querySelector('textarea[name=description]');
const address = document.querySelector('input[name=address]');
const number = document.querySelector('input[name=number]');
const city = document.querySelector('input[name=city]');
const postalcode = document.querySelector('input[name=postalcode]');
const serkens = document.querySelector('input[name=tokens]');
const role = document.querySelector('select[name=role]');
const points = document.querySelector('input[name=points]');

actionEdit.forEach(edit => {
  edit.addEventListener('click', async function () {
    const id = this.getAttribute('data-id');
    const {data: {user}} = await axios.get(`/admin/users/${id}`);
    editForm.action = `/admin/users/${id}`;
    editForm.method = 'POST';
    name.value = user.name ? user.name : '';
    description.value = user.description ? user.description : '' ;
    role.value = user.role.length ? user.role[0] : 'ROLE_USER' ;
    address.value = user.address ? user.address : '' ;
    number.value = user.number ? user.number : '';
    city.value = user.city ? user.city : '';
    postalcode.value = user.postalcode ? user.postalcode : '';
    serkens.value = user.wallet.tokens ? user.wallet.tokens : 0;
    points.value = user.points ? user.points : 0;
    $(editUserModal).modal('show');
  });
});
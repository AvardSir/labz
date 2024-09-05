import React from 'react';
import ReactDOM from 'react-dom/client'; // Убедитесь, что импорт правильный
import './css/index.css'

import Input from './component/Input';
import Users from './component/Users';
import AddUser from './component/AddUser';

class App extends React.Component {

  constructor(props) {
    super(props);
    // Инициализация массива пользователей и других данных
    this.state = {
      users: [
        { id: 1, bio: 'Love basket', name: 'Bil', image: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fvjoy.cc%2Fwp-content%2Fuploads%2F2020%2F10%2F1523649151_1.jpg&f=1&nofb=1&ipt=486a127f4869a91a8c9d57b64aef0e7c505330d48573e4b50bcd67af15625729&ipo=images' },
        { id: 2, bio: 'good singer', name: 'Sara', image: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fimg-fotki.yandex.ru%2Fget%2F15520%2F192610752.39%2F0_1ccc62_e5fec17b_orig.jpg&f=1&nofb=1&ipt=5fe9a572132905468c148de2a2986952a6cd824fd5930ccacf8ee0c9dc29b2fa&ipo=images' },
        { id: 3, bio: 'Fast as wind', name: 'Jack', image: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcatspaw.ru%2Fwp-content%2Fuploads%2F2017%2F01%2FSmeshnyie_kotyi_---ng_D---ng_Mi---n_Ph--.jpg&f=1&nofb=1&ipt=71d2e73914e452e5d3d00d599edc491da58ddab9c73ef0753d90ce0d7be2534b&ipo=images' },
        { id: 4, bio: 'Bodybuilder', name: 'Lilo', image: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fbugaga.ru%2Fuploads%2Fposts%2F2014-05%2F1399017828_smeshnye-pushistiki-6.jpg&f=1&nofb=1&ipt=4e828f82b2f4dbd245f734261d12fea6335bef263671d5c6141ae496883f45c7&ipo=images' },
        { id: 5, bio: 'Skater', name: 'Ben', image: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fkartinka-kartinki.ru%2Fwp-content%2Fuploads%2F2022%2F09%2Fsmeshnye-koty-foto-3.jpg&f=1&nofb=1&ipt=a132497efa1bc522f370c8ac6e6ec677ba171df6eeb1a5a8397ea51ff5174603&ipo=images' }
      ],
      imageLinks: [
        'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fkartinkof.club%2Fuploads%2Fposts%2F2022-03%2F1648293431_4-kartinkof-club-p-mem-kot-s-yazikom-4.jpg&f=1&nofb=1&ipt=55188e742cb7fc7553d2d68f8fc03944709d9ad1f23f74b1d587d866846a63d9&ipo=images',
        'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fs1.1zoom.me%2Fbig7%2F929%2FCats_Juice_Glasses_497997.jpg&f=1&nofb=1&ipt=0f96ef52c835acdc4bfab9e597bc3cded378e7d41ae1e625ade8a62cb18e08bf&ipo=images',
        'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcn22.nevsedoma.com.ua%2Fp%2F25%2F2548%2F100_files%2F229538_2_nevsedoma_com_ua.jpg&f=1&nofb=1&ipt=cbce0d7df85fa9216d3058c3cbdaf9c39f8809ff88975a762772ef2b2f20e773&ipo=images',
        'https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fhq-wallpapers.ru%2Fwallpapers%2F5%2Fhq-wallpapers_ru_animals_20784_1440x900.jpg&f=1&nofb=1&ipt=1b71b75676f23933d656c0b399e6fcd6a218704f20c94b039c6e025f261f7ae0&ipo=images'
      ],
      names: [
        'John Doe',
        'Jane Smith',
        'Alice Johnson',
        'Bob Brown'
      ],
      bios: [
        'Software engineer',
        'Graphic designer',
        'Marketing expert',
        'Data scientist'
      ]
    };
  }

  componentDidMount() {
    const { imageLinks, names, bios } = this.state;
  
    // Генерация уникальных id для новых пользователей
    const newUsers = imageLinks.map((image, index) => ({
      id: Date.now() + index, // Генерация уникального id
      image: image,
      name: names[index],
      bio: bios[index]
    }));
  
    this.setState(prevState => ({
      users: [
        ...prevState.users,
        ...newUsers
      ]
    }));
  }
  addUser = (user) => {
    this.setState(prevState => ({
      users: [...prevState.users,  { ...user, id: Date.now() }]
    }));
  }

  handleDelete = (id) => {
    this.setState(prevState => ({
      users: prevState.users.filter(user => user.id !== id)
    }));
  }
  handleEdit = (id, updatedUser) => {
    this.setState(prevState => ({
        users: prevState.users.map(user =>
            user.id === id ? { ...user, ...updatedUser } : user
        )
        
    })
  )
};




  render() {
    return (
      <div className='App'>
        <Users users={this.state.users}
          onEdit={this.handleEdit}
          onDelete={this.handleDelete}

        />
        <aside>
          <AddUser onAddUser={this.addUser} />
        </aside>
      </div>
    );
  }




}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />); // Рендерим компонент Appexport default Users;


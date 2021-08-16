import { io } from 'socket.io-client';
import './index.scss';
import ClientGame from './client/ClientGame';
import { getTime } from './common/util';

window.addEventListener('load', () => {
  const socket = io('https://jsprochat.herokuapp.com');

  const $nameForm = document.getElementById('nameForm');
  const $inputName = document.getElementById('name');
  const $startGame = document.querySelector('.start-game');
  const $chatWrap = document.querySelector('.chat-wrap');
  const $form = document.getElementById('form');
  const $input = document.getElementById('input');
  const $message = document.querySelector('.message');
  let userId;

  const submitName = (e) => {
    e.preventDefault();
    if ($inputName.value) {
      $startGame.remove();
      ClientGame.init({ tagId: 'game', playerName: $inputName.value });
    }
    socket.emit('start', $inputName.value);

    $chatWrap.style.display = 'block';
    $nameForm.removeEventListener('submit', submitName);
  };

  $nameForm.addEventListener('submit', submitName);

  $form.addEventListener('submit', (e) => {
    e.preventDefault();

    if ($input.value) {
      console.log('###: $input', $input.value);
      socket.emit('chat message', $input.value);
      $input.value = '';
    }
  });

  socket.on('chat connection', (data) => {
    console.log('### data', data);
    $message.insertAdjacentHTML('beforeend', `<p><strong>${getTime(data.time)}</strong> - ${data.msg}</p>`);
  });
  socket.on('chat disconnect', (data) => {
    console.log('### data', data);
    $message.insertAdjacentHTML('beforeend', `<p><strong>${getTime(data.time)}</strong> - ${data.msg}</p>`);
  });

  socket.on('chat message', (data) => {
    console.log('### chat message', data);
    $message.insertAdjacentHTML(
      'beforeend',
      `<p class=${data.id === userId && `send-message`}><strong>${getTime(data.time)}</strong> - ${data.name} : ${
        data.msg
      }</p>`,
    );
  });

  socket.on('chat online', (data) => {
    console.log('### chat online', data);
    userId = data.names.filter(({ name }) => name === $inputName.value)[0]?.id;
    console.log(userId);
    $message.insertAdjacentHTML('beforeend', `<p><strong>${getTime(data.time)}</strong> - online - ${data.online}</p>`);
  });
});

import { useState } from 'react';

export const StartButton: React.FC<{
  joinGame: (name: string) => void;
}> = ({ joinGame }) => {
  const [name, setName] = useState('');
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        joinGame(name);
      }}
    >
      <input
        className="p-1 rounded text-black placeholder-gray-700"
        type="text"
        placeholder="Enter your name"
        value={name}
        onChange={(event) => setName(event.target.value)}
      />
      {name && name.length > 2 && (
        <button
          className="text-white font-bold py-1 px-2 rounded ml-2"
          type="submit"
          onClick={() => {
            joinGame(name);
          }}
        >
          Join
        </button>
      )}
    </form>
  );
};

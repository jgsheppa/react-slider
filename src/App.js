import './App.css';
import React from 'react';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';
import ImageSlider from './components/ImageSlider.js';

// WordPress - GraphQL endpoint
const client = new ApolloClient({
  uri: 'http://sheppardimageslider.eu/graphql',
});

console.log(client);

function App() {
  return (
    <div className="App">
      <ApolloProvider client={client}>
        <div>
          <main>
            <ImageSlider />
          </main>
        </div>
      </ApolloProvider>
    </div>
  );
}

export default App;

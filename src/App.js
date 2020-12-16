import './App.css';
import React from 'react';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';
// import { BrowserRouter, Route, Router } from 'react-router-dom';
import ImageSlider from './components/ImageSlider.js';
import ColorSlides from './components/Example';

const client = new ApolloClient({
  uri: 'http://localhost:8888/wordpress/graphql',
});

function App() {
  return (
    <div className="App">
      <ApolloProvider client={client}>
        <div>
          <main>
            {/* <ColorSlides></ColorSlides> */}
            <ImageSlider></ImageSlider>
          </main>
        </div>
      </ApolloProvider>
    </div>
  );
}

export default App;

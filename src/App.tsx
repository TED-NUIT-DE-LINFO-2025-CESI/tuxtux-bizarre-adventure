import { useEffect, useMemo } from 'react';
import { useGameStore } from './stores';
import { MainMenu } from './components/ui';
import { GameContainer, SceneRenderer } from './components/core';
import { SceneSchema, CharacterDefinitionSchema } from './schemas';
import introScene from './data/scenes/common/intro.json';
import charactersData from './data/characters.json';
import { z } from 'zod';

// Parse and validate data at load time
const CharactersArraySchema = z.array(CharacterDefinitionSchema);

function App() {
  const { currentScreen, setCurrentScene, currentScene, selectPath } = useGameStore();

  // Validate characters once
  const characters = useMemo(() => {
    return CharactersArraySchema.parse(charactersData.characters);
  }, []);

  useEffect(() => {
    if (currentScreen === 'game' && !currentScene) {
      const validatedScene = SceneSchema.parse(introScene);
      setCurrentScene(validatedScene);
    }
  }, [currentScreen, currentScene, setCurrentScene]);

  const handleSceneEnd = (nextSceneId: string) => {
    if (nextSceneId.startsWith('windows')) {
      selectPath('windows');
    } else if (nextSceneId.startsWith('linux')) {
      selectPath('linux');
    }

    // TODO: Load next scene
    console.log('Next scene:', nextSceneId);
  };

  if (currentScreen === 'main-menu') {
    return <MainMenu />;
  }

  if (currentScreen === 'game' && currentScene) {
    return (
      <GameContainer>
        <SceneRenderer
          scene={currentScene}
          characters={characters}
          onSceneEnd={handleSceneEnd}
        />
      </GameContainer>
    );
  }

  return <MainMenu />;
}

export default App;

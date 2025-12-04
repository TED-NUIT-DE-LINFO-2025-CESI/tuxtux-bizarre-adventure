import { AnimatePresence } from 'motion/react';
import { Background } from './Background';
import { CharacterSprite } from './CharacterSprite';
import { DialogueBox } from './DialogueBox';
import { ChoiceMenu } from './ChoiceMenu';
import { useGameStore } from '../../stores';
import type { Scene, CharacterDefinition, Choice } from '../../types';
import './SceneRenderer.css';

interface SceneRendererProps {
  scene: Scene;
  characters: CharacterDefinition[];
  onSceneEnd?: (nextSceneId: string) => void;
}

export const SceneRenderer = ({ scene, characters, onSceneEnd }: SceneRendererProps) => {
  const {
    currentDialogue,
    visibleCharacters,
    isShowingChoices,
    availableChoices,
    advanceDialogue,
    selectChoice,
  } = useGameStore();

  const handleAdvance = () => {
    if (!isShowingChoices) {
      advanceDialogue();
    }
  };

  const handleChoice = (choice: Choice) => {
    selectChoice(choice);
    onSceneEnd?.(choice.nextSceneId);
  };

  return (
    <div className="scene-renderer" onClick={handleAdvance}>
      <Background src={scene.background} />

      <div className="scene-renderer__characters">
        <AnimatePresence>
          {visibleCharacters.map((sprite) => {
            const character = characters.find((c) => c.id === sprite.characterId);
            if (!character) return null;
            return (
              <CharacterSprite
                key={sprite.characterId}
                sprite={sprite}
                character={character}
              />
            );
          })}
        </AnimatePresence>
      </div>

      {!isShowingChoices && currentDialogue && (
        <DialogueBox
          dialogue={currentDialogue}
          characters={characters}
          onAdvance={handleAdvance}
        />
      )}

      {isShowingChoices && availableChoices && (
        <ChoiceMenu choices={availableChoices} onSelect={handleChoice} />
      )}
    </div>
  );
};

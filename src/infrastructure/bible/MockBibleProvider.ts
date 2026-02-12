import {
  BibleProvider,
  FetchVerseResult,
  VerseResult,
} from '@/domain/services/BibleProvider';
import { Reference } from '@/domain/models/Reference';

/**
 * Mock Bible Provider for testing and development
 * Returns sample verse text without external API calls
 */
export class MockBibleProvider implements BibleProvider {
  private readonly mockVerses: Map<string, string> = new Map([
    [
      'Juan:1:12',
      'Mas a todos los que le recibieron, a los que creen en su nombre, les dio potestad de ser hechos hijos de Dios.',
    ],
    [
      'Romanos:8:1-2',
      'Ahora, pues, ninguna condenación hay para los que están en Cristo Jesús, los que no andan conforme a la carne, sino conforme al Espíritu. Porque la ley del Espíritu de vida en Cristo Jesús me ha librado de la ley del pecado y de la muerte.',
    ],
    [
      'Efesios:2:10',
      'Porque somos hechura suya, creados en Cristo Jesús para buenas obras, las cuales Dios preparó de antemano para que anduviésemos en ellas.',
    ],
    [
      'Romanos:8:38-39',
      'Por lo cual estoy seguro de que ni la muerte, ni la vida, ni ángeles, ni principados, ni potestades, ni lo presente, ni lo por venir, ni lo alto, ni lo profundo, ni ninguna otra cosa creada nos podrá separar del amor de Dios, que es en Cristo Jesús Señor nuestro.',
    ],
    [
      '2 Corintios:5:17',
      'De modo que si alguno está en Cristo, nueva criatura es; las cosas viejas pasaron; he aquí todas son hechas nuevas.',
    ],
    [
      'Gálatas:5:1',
      'Estad, pues, firmes en la libertad con que Cristo nos hizo libres, y no estéis otra vez sujetos al yugo de esclavitud.',
    ],
    [
      'Efesios:1:4',
      'Según nos escogió en él antes de la fundación del mundo, para que fuésemos santos y sin mancha delante de él.',
    ],
    [
      'Efesios:1:13-14',
      'En él también vosotros, habiendo oído la palabra de verdad, el evangelio de vuestra salvación, y habiendo creído en él, fuisteis sellados con el Espíritu Santo de la promesa, que es las arras de nuestra herencia hasta la redención de la posesión adquirida, para alabanza de su gloria.',
    ],
    [
      '1 Corintios:6:19-20',
      '¿O ignoráis que vuestro cuerpo es templo del Espíritu Santo, el cual está en vosotros, el cual tenéis de Dios, y que no sois vuestros? Porque habéis sido comprados por precio; glorificad, pues, a Dios en vuestro cuerpo y en vuestro espíritu, los cuales son de Dios.',
    ],
    [
      'Jeremías:31:3',
      'Jehová se manifestó a mí hace ya mucho tiempo, diciendo: Con amor eterno te he amado; por tanto, te prolongué mi misericordia.',
    ],
  ]);

  getName(): string {
    return 'MockBibleProvider';
  }

  isConfigured(): boolean {
    return true;
  }

  async fetchVerse(reference: Reference): Promise<FetchVerseResult> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Create lookup key
    const key = `${reference.book}:${reference.chapter}:${reference.verseStart}${reference.verseEnd ? `-${reference.verseEnd}` : ''}`;

    const text = this.mockVerses.get(key);

    if (!text) {
      return {
        error: `Mock verse not found: ${reference.display}`,
        reference,
      };
    }

    const result: VerseResult = {
      text,
      reference,
      translation: reference.translation,
    };

    return result;
  }
}

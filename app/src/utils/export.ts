import { toPng } from 'html-to-image';

export const exportScreenToImage = async (screenId: string, screenName: string) => {
    const element = document.getElementById(screenId);
    if (!element) {
        console.error(`Screen element with id ${screenId} not found`);
        return;
    }

    try {
        const dataUrl = await toPng(element, { cacheBust: true, pixelRatio: 2 });
        const link = document.createElement('a');
        link.download = `${screenName.replace(/\s+/g, '_')}_wireframe.png`;
        link.href = dataUrl;
        link.click();
    } catch (err) {
        console.error('Failed to export image', err);
    }
};

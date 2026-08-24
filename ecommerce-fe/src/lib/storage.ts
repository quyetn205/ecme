export function getItem<T>(key: string): T | null {
    try {
        const item = localStorage.getItem(key);
        return item ? (JSON.parse(item) as T) : null;
    } catch {
        return null;
    }
}

export function setItem<T>(key: string, value: T): void {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error('Error saving to localStorage:', error);
    }
}

export function removeItem(key: string): void {
    localStorage.removeItem(key);
}

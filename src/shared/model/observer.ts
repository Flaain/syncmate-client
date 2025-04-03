export abstract class Observer<T> {
    protected subscribers: Set<(data: T) => void>;

    constructor() {
        this.subscribers = new Set();
    }

    subscribe = (subscriber: (data: T) => void) => {
        this.subscribers.add(subscriber);

        return () => this.subscribers.delete(subscriber);
    };

    protected notify = (data: T) => {
        this.subscribers.forEach((subscriber) => subscriber(data));
    };
}
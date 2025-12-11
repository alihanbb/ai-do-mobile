// src/core/domain/value-objects/UniqueId.ts
// Value object for unique identifiers

export class UniqueId {
    private readonly _value: string;

    constructor(value?: string) {
        this._value = value || UniqueId.generate();
    }

    get value(): string {
        return this._value;
    }

    static generate(): string {
        return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
    }

    equals(other: UniqueId): boolean {
        return this._value === other._value;
    }

    toString(): string {
        return this._value;
    }
}

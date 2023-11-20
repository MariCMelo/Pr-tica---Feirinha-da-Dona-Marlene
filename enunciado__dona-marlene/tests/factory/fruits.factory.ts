
import { FruitInput } from "services/fruits-service"

export function createFruit(name?: string, price?: number) {
    const fruit = FruitInput = {
        name: name,
        price: price 
    }
    return fruit
}
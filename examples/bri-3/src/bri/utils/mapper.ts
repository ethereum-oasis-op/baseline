export default class Mapper {

    static map<T, R>(from: T, to: R) : R {

        if(!from) throw new Error('')

        if(!to) throw new Error('')

        const props = Object.getOwnPropertyNames(to);
        if(!Array.isArray(props)) {
            throw new Error('')
        }

        let result = {};
        props.forEach(prop => {
            Object.defineProperty(result, prop, {
                value: from[prop]
              });
        })

        return result as R;
    }

    static convert<T, R>(from: T, props: any[]) {

        console.log(props)

        if(!from) throw new Error('undefined source')

        //const props = Object.getOwnPropertyNames(to);
        if(!props || !Array.isArray(props)) {
            throw new Error('invalid props');
        }

        let result = {};
        props.forEach(prop => {
            Object.defineProperty(result, prop, {
                value: from[prop]
              });
        })

        return result;
    }

}

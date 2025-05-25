export function env<E>(name: string, parse: (data: (string | undefined)) => E): E {
    return parse(process.env[name]);
}
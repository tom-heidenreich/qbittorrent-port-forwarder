import { ZodError } from "zod/v4";

class EnvError extends Error {
  constructor(env_name: string, message: string) {
    super(`${env_name}: ${message}`);
  }
}

export function env<E>(
  name: string,
  parse: (data: string | undefined) => E
): E {
  try {
    return parse(process.env[name]);
  } catch (e) {
    if (e instanceof ZodError) {
      const issue = e.issues[0];
      switch (issue.code) {
        case "invalid_format": {
          throw new EnvError(
            name,
            "Variable is in an invalid format!" +
              (issue.pattern && ` Expected pattern ${issue.pattern}`)
          );
        }
        case "invalid_type": {
          throw new EnvError(name, issue.message);
        }
        default: {
          throw new EnvError(name, "Unexpected Zod Error! " + issue.message);
        }
      }
    }
    throw new EnvError(name, "Unexpected Error! " + e);
  }
}

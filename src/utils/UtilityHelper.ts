export class UtilityHelper {
    static stringToBool(str: string | undefined | null): boolean {
        return str?.toLowerCase() === "true";
    }
}
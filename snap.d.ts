declare namespace snap {
    function snap(stdout: string, name?: string): Promise<void> | Promise<string>;
}
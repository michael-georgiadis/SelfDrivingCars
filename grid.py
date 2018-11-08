class Grid:

    def __init__(self, rows, columns, total_steps, bonus):
        self.rows = rows
        self.columns = columns
        self.total_steps = total_steps
        self.bonus = bonus
        self.current_steps = 0

    def __str__(self):
        return "Grid with {rows} rows, {columns} columns," \
               " total steps of {total_steps} and bonus of {bonus}".format(**self.__dict__)


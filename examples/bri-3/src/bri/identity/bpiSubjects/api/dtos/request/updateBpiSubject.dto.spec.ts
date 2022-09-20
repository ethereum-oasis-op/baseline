import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { UpdateBpiSubjectDto } from "./updateBpiSubject.dto";

describe('UpdateBpiSubjectDto', () => {
    it('should return error in case name not provided.', async () => {
        // Arrange
        const dto = { desc: 'this is a description', publicKey: '2323' };
        const updateBpiSubjectDto = plainToInstance(UpdateBpiSubjectDto, dto);

        // Act
        const errors = await validate(updateBpiSubjectDto);

        // Assert
        expect(errors.length).toBe(1);
        expect(errors[0].property).toEqual('name');
        expect(errors[0].constraints.isNotEmpty).toContain("name should not be empty");
    });

    it('should return error in case desc not provided.', async () => {
        // Arrange
        const dto = { name: 'test', publicKey: '2323' };
        const updateBpiSubjectDto = plainToInstance(UpdateBpiSubjectDto, dto);

        // Act
        const errors = await validate(updateBpiSubjectDto);

        // Assert
        expect(errors.length).toBe(1);
        expect(errors[0].property).toEqual('desc');
        expect(errors[0].constraints.isNotEmpty).toContain("desc should not be empty");
    });

    it('should return error in case publicKey not provided.', async () => {
        // Arrange
        const dto = { name: 'test', desc: 'this is a description' };
        const updateBpiSubjectDto = plainToInstance(UpdateBpiSubjectDto, dto);

        // Act
        const errors = await validate(updateBpiSubjectDto);

        // Assert
        expect(errors.length).toBe(1);
        expect(errors[0].property).toEqual('publicKey');
        expect(errors[0].constraints.isNotEmpty).toContain("publicKey should not be empty");
    });

    it('should return no error if all required properties provided.', async () => {
        // Arrange
        const dto = { name: 'test', desc: 'this is a description', publicKey: '2323' };
        const updateBpiSubjectDto = plainToInstance(UpdateBpiSubjectDto, dto);

        // Act
        const errors = await validate(updateBpiSubjectDto);

        // Assert
        expect(errors.length).toBe(0);
    });
})
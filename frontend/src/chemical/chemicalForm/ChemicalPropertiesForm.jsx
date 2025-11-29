import React from "react";
import { Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const ChemicalPropertiesForm = ({ control }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="iupac">IUPAC Name</Label>
          <Controller
            name="iupac"
            control={control}
            render={({ field }) => (
              <Input {...field} id="iupac" placeholder="IUPAC Name" />
            )}
          />
        </div>
        <div>
          <Label htmlFor="h_s_code">HS Code</Label>
          <Controller
            name="h_s_code"
            control={control}
            render={({ field }) => (
              <Input {...field} id="h_s_code" placeholder="HS Code" />
            )}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="molecular_weight">Molecular Weight</Label>
          <Controller
            name="molecular_weight"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                id="molecular_weight"
                placeholder="Molecular Weight"
              />
            )}
          />
        </div>
        <div>
          <Label htmlFor="molecular_formula">Molecular Formula</Label>
          <Controller
            name="molecular_formula"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                id="molecular_formula"
                placeholder="Molecular Formula"
              />
            )}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="form">Form</Label>
          <Controller
            name="form"
            control={control}
            render={({ field }) => (
              <Input {...field} id="form" placeholder="Form" />
            )}
          />
        </div>
        <div>
          <Label htmlFor="meltingPoint">Melting Point</Label>
          <Controller
            name="meltingPoint"
            control={control}
            render={({ field }) => (
              <Input {...field} id="meltingPoint" placeholder="Melting Point" />
            )}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="boilingPoint">Boiling Point</Label>
          <Controller
            name="boilingPoint"
            control={control}
            render={({ field }) => (
              <Input {...field} id="boilingPoint" placeholder="Boiling Point" />
            )}
          />
        </div>
        <div>
          <Label htmlFor="solubility">Solubility</Label>
          <Controller
            name="solubility"
            control={control}
            render={({ field }) => (
              <Input {...field} id="solubility" placeholder="Solubility" />
            )}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="flashPoint">Flash Point</Label>
          <Controller
            name="flashPoint"
            control={control}
            render={({ field }) => (
              <Input {...field} id="flashPoint" placeholder="Flash Point" />
            )}
          />
        </div>
        <div>
          <Label htmlFor="class">Class</Label>
          <Controller
            name="class"
            control={control}
            render={({ field }) => (
              <Input {...field} id="class" placeholder="Class" />
            )}
          />
        </div>
      </div>
      <div>
        <Label htmlFor="olfactory">Olfactory</Label>
        <Controller
          name="olfactory"
          control={control}
          render={({ field }) => (
            <Input {...field} id="olfactory" placeholder="Olfactory" />
          )}
        />
      </div>
    </div>
  );
};

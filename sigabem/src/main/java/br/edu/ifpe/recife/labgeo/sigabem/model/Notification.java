package br.edu.ifpe.recife.labgeo.sigabem.model;

import lombok.Data;

@Data
public class Notification {
	
	private String app_id;
	private String included_segments;
	private String title;
	private String contents;
}
